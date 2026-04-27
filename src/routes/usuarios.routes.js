const router = require('express').Router()
const ctrl = require('../controllers/usuarios.controller')

router.get('/', ctrl.getUsuarios)
router.get('/:id', ctrl.getUsuario)
router.post('/', ctrl.createUsuario)
router.put('/:id', ctrl.updateUsuario)
router.delete('/:id', ctrl.deleteUsuario)

module.exports = router
