const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gestión de proyectos y tareas'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            email: { type: 'string' },
            creadoEn: { type: 'string', format: 'date-time' }
          }
        },
        Proyecto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            usuarioId: { type: 'integer' },
            creadoEn: { type: 'string', format: 'date-time' }
          }
        },
        Tarea: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            titulo: { type: 'string' },
            descripcion: { type: 'string' },
            estado: { type: 'string', enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] },
            proyectoId: { type: 'integer' },
            usuarioId: { type: 'integer', nullable: true },
            creadoEn: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

module.exports = swaggerJsdoc(options)
