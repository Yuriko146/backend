const prisma = require('../prisma')

// GET /api/usuarios
async function getUsuarios(req, res, next) {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { creadoEn: 'desc' },
      select: { id: true, nombre: true, email: true, creadoEn: true }
    })
    res.json(usuarios)
  } catch (err) { next(err) }
}

// GET /api/usuarios/:id
async function getUsuario(req, res, next) {
  try {
    const usuario = await prisma.usuario.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
      select: { id: true, nombre: true, email: true, creadoEn: true }
    })
    res.json(usuario)
  } catch (err) { next(err) }
}

// POST /api/usuarios
async function createUsuario(req, res, next) {
  try {
    const { nombre, email, password } = req.body
    if (!nombre || nombre.length < 2) return res.status(400).json({ error: 'nombre: mínimo 2 caracteres.' })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'email: formato inválido.' })
    if (!password || password.length < 6) return res.status(400).json({ error: 'password: mínimo 6 caracteres.' })

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password },
      select: { id: true, nombre: true, email: true, creadoEn: true }
    })
    res.status(201).json(usuario)
  } catch (err) { next(err) }
}

// PUT /api/usuarios/:id
async function updateUsuario(req, res, next) {
  try {
    const { nombre, email, password } = req.body
    if (nombre && nombre.length < 2) return res.status(400).json({ error: 'nombre: mínimo 2 caracteres.' })
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'email: formato inválido.' })
    if (password && password.length < 6) return res.status(400).json({ error: 'password: mínimo 6 caracteres.' })

    const usuario = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: { ...(nombre && { nombre }), ...(email && { email }), ...(password && { password }) },
      select: { id: true, nombre: true, email: true, creadoEn: true }
    })
    res.json(usuario)
  } catch (err) { next(err) }
}

// DELETE /api/usuarios/:id
async function deleteUsuario(req, res, next) {
  try {
    await prisma.usuario.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Usuario eliminado correctamente.' })
  } catch (err) { next(err) }
}

module.exports = { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario }
