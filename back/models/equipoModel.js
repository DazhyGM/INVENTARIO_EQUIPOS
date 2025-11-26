const db = require('../config/db');

const getEquipoByNombre = (nombre, callback) => {
  const query = `
    SELECT 
      equipo.id_equipo,
      equipo.hostname,
      estado_equipo.nombre AS nombre_estado,
      equipo.fecha_registro,
      equipo.fecha_finalizacion,
      campaña.nombre_campaña
    FROM equipo
    LEFT JOIN estado_equipo ON equipo.estado_fk = estado_equipo.id_estado
    LEFT JOIN campaña ON equipo.id_campaña = campaña.id_campaña
    WHERE equipo.hostname = ?
  `;

  console.log("Ejecutando consulta con hostname:", nombre); 
  db.query(query, [nombre], (err, results) => {
    if (err) {
      console.error("Error en consulta SQL:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getAllEquipos = (callback) => {
  const query = `
    SELECT 
      equipo.id_equipo,
      equipo.hostname,
      estado_equipo.nombre AS nombre_estado,
      equipo.fecha_registro,
      equipo.fecha_finalizacion,
      campaña.nombre_campaña
    FROM equipo
    LEFT JOIN estado_equipo ON equipo.estado_fk = estado_equipo.id_estado
    LEFT JOIN campaña ON equipo.id_campaña = campaña.id_campaña
  `;

  db.query(query, callback);
};

const createEquipo = (equipo, callback) => {
  db.query('INSERT INTO equipo SET ?', equipo, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    const id_equipo = result.insertId;
    const tareasIniciales = [1, 2, 3, 4, 5];
    const estadoInicial = 2;
    const registros = tareasIniciales.map(id_tarea => [
      id_equipo,   
      id_tarea,   
      estadoInicial
    ]);

    const insertQuery = `
      INSERT INTO equipo_tarea (id_equipo, id_tarea, estado_tarea_fk)
      VALUES ?
    `;

    db.query(insertQuery, [registros], (err2) => {
      if (err2) {
        return callback(err2, null);
      }
      callback(null, { message: 'Equipo y tareas iniciales creados correctamente' });
    });
  });
};

const getCampañas = (callback) => {
  const query = 'SELECT id_campaña, nombre_campaña FROM campaña';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const asignarCampaniaEquipo = (hostname, id_campaña, callback) => {
  const query = 'UPDATE equipo SET id_campaña = ? WHERE hostname = ?';
  db.query(query, [id_campaña, hostname], callback);
};

const actualizarEstadoYFecha = (id_equipo, estado_fk, fecha_finalizacion, callback) => {
    db.query(
        'UPDATE equipo SET estado_fk = ?, fecha_finalizacion = ? WHERE id_equipo = ?',
        [estado_fk, fecha_finalizacion, id_equipo],
        callback
    );
};

const deleteEquipo = (hostname, callback) => {
  const query = 'DELETE FROM equipo WHERE hostname = ?';
  db.query(query, [hostname], callback);
};

module.exports = {
  getEquipoByNombre,
  getAllEquipos,
  createEquipo,
  getCampañas,
  asignarCampaniaEquipo,
  actualizarEstadoYFecha,
  deleteEquipo
};
