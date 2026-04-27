const prisma = require('../prisma')

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA']

// GET /api/tareas
async function getTareas(req, res, next) {
  try {
    const { proyectoId, estado } = req.query
    const where = {}
    if (proyectoId) where.proyectoId = Number(proyectoId)
    if (estado && ESTADOS_VALIDOS.includes(estado)) where.estado = estado

    const tareas = await prisma.tarea.findMany({
      where,
      orderBy: { creadoEn: 'desc' },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } }
      }
    })
    res.json(tareas)
  } catch (err) { next(err) }
}

// GET /api/tareas/:id
async function getTarea(req, res, next) {
  try {
    const tarea = await prisma.tarea.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } }
      }
    })
    res.json(tarea)
  } catch (err) { next(err) }
}

// POST /api/tareas
async function createTarea(req, res, next) {
  try {
    const { titulo, descripcion, proyectoId, usuarioId, estado } = req.body
    if (!titulo || titulo.length < 3) return res.status(400).json({ error: 'titulo: mínimo 3 caracteres.' })
    if (!descripcion) return res.status(400).json({ error: 'descripcion: requerida.' })
    if (!proyectoId) return res.status(400).json({ error: 'proyectoId: requerido.' })
    if (estado && !ESTADOS_VALIDOS.includes(estado)) return res.status(400).json({ error: 'estado: valor inválido.' })

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        proyectoId: Number(proyectoId),
        usuarioId: usuarioId ? Number(usuarioId) : null,
        estado: estado || 'PENDIENTE'
      },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } }
      }
    })
    res.status(201).json(tarea)
  } catch (err) { next(err) }
}

// PUT /api/tareas/:id
async function updateTarea(req, res, next) {
  try {
    const { titulo, descripcion, proyectoId, usuarioId, estado } = req.body
    if (titulo && titulo.length < 3) return res.status(400).json({ error: 'titulo: mínimo 3 caracteres.' })
    if (estado && !ESTADOS_VALIDOS.includes(estado)) return res.status(400).json({ error: 'estado: valor inválido.' })

    const tarea = await prisma.tarea.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion && { descripcion }),
        ...(proyectoId && { proyectoId: Number(proyectoId) }),
        ...(estado && { estado }),
        ...(usuarioId !== undefined && { usuarioId: usuarioId ? Number(usuarioId) : null })
      },
      include: {
        proyecto: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } }
      }
    })
    res.json(tarea)
  } catch (err) { next(err) }
}

// DELETE /api/tareas/:id
async function deleteTarea(req, res, next) {
  try {
    await prisma.tarea.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Tarea eliminada correctamente.' })
  } catch (err) { next(err) }
}

module.exports = { getTareas, getTarea, createTarea, updateTarea, deleteTarea }
