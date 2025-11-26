const express = require('express')
const router = express.Router()
const tareasController = require('../controllers/tareasController')

router.get('/hostname/:hostname', tareasController.getTareasByHostname)
router.post('/equipo/:id_equipo', tareasController.addTarea)
router.put('/:id_equipo_tarea', tareasController.actualizarPorIdEquipoTarea);
router.delete('/:id_tarea', tareasController.removeTarea)

module.exports = router
