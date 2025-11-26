const equipoModel = require('../models/equipoModel');

const getEquipos = (req, res) => {
  const nombre = req.query.nombre;

  if (nombre) {
    equipoModel.getEquipoByNombre(nombre, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al buscar equipos' });
      }
      res.json(results);
    });
  } else {
    equipoModel.getAllEquipos((err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener equipos' });
      }
      res.json(results);
    });
  }
};

const registerEquipo = (req, res) => {
  const { nombre, id_campaña } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del equipo es requerido' });
  }
  equipoModel.getEquipoByNombre(nombre, (err, resultados) => {
    if (err) {
      console.error('Error al buscar el equipo:', err);
      return res.status(500).json({ error: 'Error al verificar si el equipo ya existe' });
    }
    if (resultados.length > 0) {
      return res.status(409).json({ error: 'El equipo ya está registrado' });
    }
    const fechaRegistro = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

    const nuevoEquipo = {
      hostname: nombre.trim(),
      estado_fk: 1,
      fecha_registro: fechaRegistro,
      id_campaña: id_campaña || null
    };

    equipoModel.createEquipo(nuevoEquipo, (err, result) => {
      if (err) {
        console.error('Error al registrar equipo:', err);
        return res.status(500).json({ error: 'Error al registrar el equipo' });
      }

      res.status(201).json({
        id_equipo: result.insertId,
        mensaje: 'Equipo registrado correctamente',
        equipo: nuevoEquipo
      });
    });
  });
};


const getCampañas = (req, res) => {
  equipoModel.getCampañas((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener campañas' });
    }
    res.json(data);
  });
};

const asignarCampania = (req, res) => {
  const { hostname } = req.params;
  const { id_campaña } = req.body;

  equipoModel.asignarCampaniaEquipo(hostname, id_campaña, (err, result) => {
    if (err) {
      console.error('Error al asignar campaña:', err);
      return res.status(500).json({ error: 'Error al asignar campaña' });
    }
    res.status(200).json({ message: 'Campaña asignada correctamente' });
  });
};

const deleteEquipo = (req, res) => {
  const { hostname } = req.params;

  equipoModel.deleteEquipo(hostname, (err, result) => {
    if (err) {
      console.error('Error al eliminar equipo:', err);
      return res.status(500).json({ error: 'Error al eliminar el equipo' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.status(200).json({ message: 'Equipo eliminado correctamente' });
  });
};

module.exports = {
  getEquipos,
  registerEquipo,
  getCampañas,
  asignarCampania,
  deleteEquipo
};
