const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

router.get('/equipo', equipoController.getEquipos);
router.post('/equipo', equipoController.registerEquipo);
router.get('/campanias', equipoController.getCampañas);
router.put('/asignar-campania/:hostname', equipoController.asignarCampania);
router.delete('/equipo/:hostname', equipoController.deleteEquipo);


module.exports = router;
