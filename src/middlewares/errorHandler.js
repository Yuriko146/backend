function errorHandler(err, req, res, next) {
  console.error(err)

  // Prisma unique constraint (P2002)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único (ej: email duplicado).' })
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado.' })
  }

  // Prisma foreign key constraint (P2003)
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Referencia inválida: el registro relacionado no existe.' })
  }

  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Error interno del servidor.' })
}

module.exports = errorHandler
