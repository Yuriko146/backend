const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de proyectos
 */

router.get('/', async (req, res, next) => {
  try {
    const proyectos = await prisma.proyecto.findMany({
      include: { usuario: { select: { id: true, nombre: true } } },
      orderBy: { creadoEn: 'desc' },
    });
    res.json(proyectos);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: Number(req.params.id) },
      include: { usuario: { select: { id: true, nombre: true } }, tareas: true },
    });
    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, usuarioId } = req.body;
    if (!nombre || nombre.length < 3)
      return res.status(400).json({ error: 'El nombre debe tener mínimo 3 caracteres' });
    if (!descripcion)
      return res.status(400).json({ error: 'La descripción es requerida' });
    if (!usuarioId)
      return res.status(400).json({ error: 'Debe seleccionar un usuario responsable' });

    const proyecto = await prisma.proyecto.create({
      data: { nombre, descripcion, usuarioId: Number(usuarioId) },
      include: { usuario: { select: { id: true, nombre: true } } },
    });
    res.status(201).json(proyecto);
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ error: 'El usuario no existe' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, descripcion, usuarioId } = req.body;
    if (nombre && nombre.length < 3)
      return res.status(400).json({ error: 'El nombre debe tener mínimo 3 caracteres' });

    const proyecto = await prisma.proyecto.update({
      where: { id: Number(req.params.id) },
      data: {
        nombre,
        descripcion,
        usuarioId: usuarioId ? Number(usuarioId) : undefined,
      },
      include: { usuario: { select: { id: true, nombre: true } } },
    });
    res.json(proyecto);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.proyecto.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    next(err);
  }
});

module.exports = router;
