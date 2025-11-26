const db = require('../config/db');

const getTareasByEquipo = (id_equipo, callback) => {
  const query = `
    SELECT 
      et.id_equipo_tarea,
      t.id_tarea,
      t.nombre_tarea,
      et.fecha_asignacion,
      et.estado_tarea_fk,
      et.comentario,
      est.nombre AS estado
    FROM equipo_tarea et
    INNER JOIN equipo e ON et.id_equipo = e.id_equipo
    INNER JOIN tareas t ON et.id_tarea = t.id_tarea
    INNER JOIN estado_tarea est ON et.estado_tarea_fk = est.id_estado
    WHERE e.id_equipo = ?
    ORDER BY CASE t.nombre_tarea
      WHEN 'Validacion estado actual' THEN 1
      WHEN 'Montar imagen' THEN 2
      WHEN 'Validacion aplicaciones instaladas' THEN 3
      WHEN 'Verificacion reporte consolas (S1, SCCM, AD)' THEN 4
      WHEN 'Logueo usuario' THEN 5
    END
  `;
  db.query(query, [id_equipo], callback);
};

const getTareasByHostname = (hostname, callback) => {
  const query = `
    SELECT 
      et.id_equipo_tarea,
      t.id_tarea,
      t.nombre_tarea,
      et.fecha_asignacion,
      et.estado_tarea_fk,
      et.comentario,
      est.nombre AS estado
    FROM equipo_tarea et
    INNER JOIN equipo e ON et.id_equipo = e.id_equipo
    INNER JOIN tareas t ON et.id_tarea = t.id_tarea
    INNER JOIN estado_tarea est ON et.estado_tarea_fk = est.id_estado
    WHERE e.hostname = ?
    ORDER BY CASE t.nombre_tarea
      WHEN 'Validacion estado actual' THEN 1
      WHEN 'Montar imagen' THEN 2
      WHEN 'Validacion aplicaciones instaladas' THEN 3
      WHEN 'Verificacion reporte consolas (S1, SCCM, AD)' THEN 4
      WHEN 'Logueo usuario' THEN 5
    END
  `;
  db.query(query, [hostname], callback);
};

const asignarTareaAEquipo = (id_equipo, id_tarea, estado_fk = 2, callback) => {
  const query = `
    INSERT INTO equipo_tarea (id_equipo, id_tarea, fecha_asignacion, estado_tarea_fk)
    VALUES (?, ?, NOW(), ?)
  `;
  db.query(query, [id_equipo, id_tarea, estado_fk], callback);
};

const actualizarEstadoPorIdEquipoTarea = (id_equipo_tarea, nuevoEstado, callback) => {
  const ESTADO_TAREA_COMPLETADA = 1;      
  const ESTADO_EQUIPO_PREPARACION = 1;     
  const ESTADO_EQUIPO_COMPLETADO = 2;      
  const qUpdateTarea = `
    UPDATE equipo_tarea
    SET estado_tarea_fk = ?
    WHERE id_equipo_tarea = ?
  `;
  db.query(qUpdateTarea, [nuevoEstado, id_equipo_tarea], (err) => {
    if (err) return callback(err);
    const qGetEquipo = `
      SELECT id_equipo
      FROM equipo_tarea
      WHERE id_equipo_tarea = ?
    `;
    db.query(qGetEquipo, [id_equipo_tarea], (err, rows) => {
      if (err) return callback(err);
      if (!rows.length) return callback(null, { message: 'Tarea no encontrada' });
      const id_equipo = rows[0].id_equipo;
      const qCount = `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN estado_tarea_fk = ? THEN 1 ELSE 0 END) AS completadas
        FROM equipo_tarea
        WHERE id_equipo = ?
      `;
      db.query(qCount, [ESTADO_TAREA_COMPLETADA, id_equipo], (err, counts) => {
        if (err) return callback(err);
        const total = counts[0].total || 0;
        const completadas = counts[0].completadas || 0;
        if (total > 0 && total === completadas) {
          const qEquipoDone = `
            UPDATE equipo
            SET estado_fk = ?, fecha_finalizacion = NOW()
            WHERE id_equipo = ?
          `;
          db.query(qEquipoDone, [ESTADO_EQUIPO_COMPLETADO, id_equipo], (err2) => {
            if (err2) return callback(err2);
            return callback(null, { message: 'Tarea actualizada y equipo marcado como Completado' });
          });
        } else {
          const qEquipoPrep = `
            UPDATE equipo
            SET estado_fk = ?, fecha_finalizacion = NULL
            WHERE id_equipo = ?
          `;
          db.query(qEquipoPrep, [ESTADO_EQUIPO_PREPARACION, id_equipo], (err3) => {
            if (err3) return callback(err3);
            return callback(null, { message: 'Tarea actualizada y equipo en preparación' });
          });
        }
      });
    });
  });
};

const actualizarComentarioPorIdEquipoTarea = (id_equipo_tarea, comentario, callback) => {
  const query = `UPDATE equipo_tarea SET comentario = ? WHERE id_equipo_tarea = ?`;
  db.query(query, [comentario, id_equipo_tarea], callback);
};

const deleteTareaEquipo = (id_equipo_tarea, callback) => {
  const query = `DELETE FROM equipo_tarea WHERE id_equipo_tarea = ?`;
  db.query(query, [id_equipo_tarea], callback);
};

const actualizarEstadoTarea = (id_equipo_tarea, estado_tarea_fk, callback) => {
  db.query(
    'UPDATE equipo_tarea SET estado_tarea_fk = ? WHERE id_equipo_tarea = ?',
    [estado_tarea_fk, id_equipo_tarea],
    callback
  );
};

const obtenerEquipoDeTarea = (id_equipo_tarea, callback) => {
  db.query(
    'SELECT id_equipo FROM equipo_tarea WHERE id_equipo_tarea = ?',
    [id_equipo_tarea],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]?.id_equipo);
    }
  );
};

const obtenerTareasPorEquipo = (id_equipo, callback) => {
  db.query(
    'SELECT estado_tarea_fk FROM equipo_tarea WHERE id_equipo = ?',
    [id_equipo],
    callback
  );
};

const cambiarEstadoTarea = (id_equipo_tarea, nuevoEstado, callback) => {
    const query = `
        UPDATE equipo_tarea
        SET estado_tarea_fk = ?
        WHERE id_equipo_tarea = ?
    `;
    db.query(query, [nuevoEstado, id_equipo_tarea], callback);
};

const verificarTareasCompletas = (id_equipo_tarea, callback) => {
  const sql = `
    SELECT et.id_equipo
    FROM equipo_tarea et
    WHERE et.id_equipo_tarea = ?`;
  db.query(sql, [id_equipo_tarea], (err, rows) => {
    if (err) return callback(err);
    if (rows.length === 0) return callback(null, false);
    const idEquipo = rows[0].id_equipo;
    const sqlCheck = `
      SELECT COUNT(*) AS pendientes
      FROM equipo_tarea
      WHERE id_equipo = ? AND estado_tarea_fk != 1`;
    db.query(sqlCheck, [idEquipo], (err, result) => {
      if (err) return callback(err);
      const pendientes = result[0].pendientes;
      callback(null, pendientes === 0, idEquipo);
    });
  });
};

const marcarEquipoComoCompletado = (idEquipo, callback) => {
  const sql = `
    UPDATE equipo
    SET estado_fk = 2,  -- 2 = Completado
        fecha_finalizacion = CURDATE()
    WHERE id_equipo = ?`;
  db.query(sql, [idEquipo], callback);
};

module.exports = {
  getTareasByHostname,
  getTareasByEquipo,
  asignarTareaAEquipo,
  actualizarEstadoPorIdEquipoTarea,
  actualizarComentarioPorIdEquipoTarea,
  deleteTareaEquipo,
  actualizarEstadoTarea,
  obtenerEquipoDeTarea,
  obtenerTareasPorEquipo,
  cambiarEstadoTarea,
  verificarTareasCompletas,
  marcarEquipoComoCompletado
};
