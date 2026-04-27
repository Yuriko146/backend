const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger/swagger')
const errorHandler = require('./middlewares/errorHandler')

const usuariosRoutes = require('./routes/usuarios.routes')
const proyectosRoutes = require('./routes/proyectos.routes')
const tareasRoutes = require('./routes/tareas.routes')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/proyectos', proyectosRoutes)
app.use('/api/tareas', tareasRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ TaskFlow API corriendo en http://localhost:${PORT}`)
  console.log(`📄 Swagger UI en http://localhost:${PORT}/api-docs`)
})
