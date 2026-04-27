const prisma = require('../prisma')

// GET /api/proyectos
async function getProyectos(req, res, next) {
  try {
    const proyectos = await prisma.proyecto.findMany({
      orderBy: { creadoEn: 'desc' },
      include: { usuario: { select: { id: true, nombre: true, email: true } } }
    })
    res.json(proyectos)
  } catch (err) { next(err) }
}

// GET /api/proyectos/:id
async function getProyecto(req, res, next) {
  try {
    const proyecto = await prisma.proyecto.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
      include: { usuario: { select: { id: true, nombre: true, email: true } }, tareas: true }
    })
    res.json(proyecto)
  } catch (err) { next(err) }
}

// POST /api/proyectos
async function createProyecto(req, res, next) {
  try {
    const { nombre, descripcion, usuarioId } = req.body
    if (!nombre || nombre.length < 3) return res.status(400).json({ error: 'nombre: mínimo 3 caracteres.' })
    if (!usuarioId) return res.status(400).json({ error: 'usuarioId: requerido.' })
    if (!descripcion) return res.status(400).json({ error: 'descripcion: requerida.' })

    const proyecto = await prisma.proyecto.create({
      data: { nombre, descripcion, usuarioId: Number(usuarioId) },
      include: { usuario: { select: { id: true, nombre: true, email: true } } }
    })
    res.status(201).json(proyecto)
  } catch (err) { next(err) }
}

// PUT /api/proyectos/:id
async function updateProyecto(req, res, next) {
  try {
    const { nombre, descripcion, usuarioId } = req.body
    if (nombre && nombre.length < 3) return res.status(400).json({ error: 'nombre: mínimo 3 caracteres.' })

    const proyecto = await prisma.proyecto.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(usuarioId && { usuarioId: Number(usuarioId) })
      },
      include: { usuario: { select: { id: true, nombre: true, email: true } } }
    })
    res.json(proyecto)
  } catch (err) { next(err) }
}

// DELETE /api/proyectos/:id
async function deleteProyecto(req, res, next) {
  try {
    await prisma.proyecto.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Proyecto eliminado correctamente.' })
  } catch (err) { next(err) }
}

module.exports = { getProyectos, getProyecto, createProyecto, updateProyecto, deleteProyecto }
