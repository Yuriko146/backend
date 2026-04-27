const router = require('express').Router()
const ctrl = require('../controllers/proyectos.controller')

router.get('/', ctrl.getProyectos)
router.get('/:id', ctrl.getProyecto)
router.post('/', ctrl.createProyecto)
router.put('/:id', ctrl.updateProyecto)
router.delete('/:id', ctrl.deleteProyecto)

module.exports = router
