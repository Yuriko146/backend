const router = require('express').Router()
const ctrl = require('../controllers/tareas.controller')

router.get('/', ctrl.getTareas)
router.get('/:id', ctrl.getTarea)
router.post('/', ctrl.createTarea)
router.put('/:id', ctrl.updateTarea)
router.delete('/:id', ctrl.deleteTarea)

module.exports = router
