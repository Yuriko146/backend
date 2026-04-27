const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

/**
 * @swagger
 * tags:
 *   name: Tareas
 *   description: Gestión de tareas
 */

router.get('/', async (req, res, next) => {
  try {
    const { proyectoId, estado } = req.query;
    const where = {};
    if (proyectoId) where.proyectoId = Number(proyectoId);
    if (estado) where.estado = estado;

    const tareas = await prisma.tarea.findMany({
      where,
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
      orderBy: { creadoEn: 'desc' },
    });
    res.json(tareas);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tarea);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { titulo, descripcion, proyectoId, usuarioId } = req.body;
    if (!titulo || titulo.length < 3)
      return res.status(400).json({ error: 'El título debe tener mínimo 3 caracteres' });
    if (!descripcion)
      return res.status(400).json({ error: 'La descripción es requerida' });
    if (!proyectoId)
      return res.status(400).json({ error: 'Debe seleccionar un proyecto' });

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        proyectoId: Number(proyectoId),
        usuarioId: usuarioId ? Number(usuarioId) : null,
      },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });
    res.status(201).json(tarea);
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ error: 'El proyecto o usuario no existe' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { titulo, descripcion, estado, proyectoId, usuarioId } = req.body;
    const estadosValidos = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
    if (estado && !estadosValidos.includes(estado))
      return res.status(400).json({ error: 'Estado inválido' });
    if (titulo && titulo.length < 3)
      return res.status(400).json({ error: 'El título debe tener mínimo 3 caracteres' });

    const tarea = await prisma.tarea.update({
      where: { id: Number(req.params.id) },
      data: {
        titulo,
        descripcion,
        estado,
        proyectoId: proyectoId ? Number(proyectoId) : undefined,
        usuarioId: usuarioId !== undefined ? (usuarioId ? Number(usuarioId) : null) : undefined,
      },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });
    res.json(tarea);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tarea no encontrada' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.tarea.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tarea no encontrada' });
    next(err);
  }
});

module.exports = router;
