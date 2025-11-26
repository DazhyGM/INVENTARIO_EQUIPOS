const tareasModel = require('../models/tareasModel');

const db = require('../config/db');

const getTareasByHostname = (req, res) => {
  const { hostname } = req.params;

  db.query('SELECT id_equipo FROM equipo WHERE hostname = ?', [hostname], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al buscar equipo' });
    if (rows.length === 0) return res.status(404).json({ error: 'Equipo no encontrado' });

    const id_equipo = rows[0].id_equipo;
    tareasModel.getTareasByEquipo(id_equipo, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
      res.json(results);
    });
  });
};

const addTarea = (req, res) => {
  const { id_equipo } = req.params;
  const { id_tarea } = req.body;

  if (!id_tarea) {
    return res.status(400).json({ error: 'El ID de la tarea es obligatorio' });
  }

  tareasModel.asignarTareaAEquipo(id_equipo, id_tarea, 2, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al asignar la tarea' });
    res.json({ message: 'Tarea asignada correctamente', id_equipo_tarea: result.insertId });
  });
};

const actualizarPorIdEquipoTarea = (req, res) => {
  const { id_equipo_tarea } = req.params;
  const { completada, comentario } = req.body;

  if (typeof completada !== 'undefined') {
    const nuevoEstadoTarea = completada ? 1 : 2;
    tareasModel.actualizarEstadoPorIdEquipoTarea(id_equipo_tarea, nuevoEstadoTarea, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error actualizando estado' });
      }

      if (nuevoEstadoTarea === 1) {
        tareasModel.verificarTareasCompletas(id_equipo_tarea, (err, todasCompletas, idEquipo) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error verificando tareas' });
          }

          if (todasCompletas) {
            tareasModel.marcarEquipoComoCompletado(idEquipo, (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error marcando equipo como completado' });
              }
              return res.json({ message: 'Estado de tarea actualizado y equipo marcado como completado' });
            });
          } else {
            return res.json({ message: 'Estado de tarea actualizado' });
          }
        });
      } else {
        return res.json({ message: 'Estado de tarea actualizado' });
      }
    });
    return;
  }

  if (typeof comentario !== 'undefined') {
    tareasModel.actualizarComentarioPorIdEquipoTarea(id_equipo_tarea, comentario, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error actualizando comentario' });
      }
      return res.json({ message: 'Comentario actualizado' });
    });
    return;
  }

  return res.status(400).json({ message: 'Nada para actualizar' });
};

const cambiarEstadoTarea = (req, res) => {
  const { id_equipo_tarea, nuevoEstado } = req.body;
  const ESTADO_TAREA_COMPLETADA = 1;
  const ESTADO_EQUIPO_COMPLETADO = 2;


  tareasModel.actualizarEstadoPorIdEquipoTarea(id_equipo_tarea, nuevoEstado, (err) => {
    if (err) {
      console.error("Error actualizando tarea:", err);
      return res.status(500).json({ message: "Error al actualizar la tarea" });
    }

    tareasModel.obtenerEquipoDeTarea(id_equipo_tarea, (err, id_equipo) => {
      if (err) {
        console.error("Error obteniendo id_equipo:", err);
        return res.status(500).json({ message: "Error al obtener el equipo" });
      }

      tareasModel.obtenerTareasPorEquipo(id_equipo, (err, tareas) => {
        if (err) {
          console.error("Error obteniendo tareas:", err);
          return res.status(500).json({ message: "Error al obtener las tareas" });
        }

        const todasCompletadas = tareas.every(t => t.estado_tarea_fk === ESTADO_TAREA_COMPLETADA);

        if (todasCompletadas) {
          db.query(
            `UPDATE equipo 
             SET estado_fk = ?, fecha_finalizacion = NOW() 
             WHERE id_equipo = ?`,
            [ESTADO_EQUIPO_COMPLETADO, id_equipo],
            (err) => {
              if (err) {
                console.error("Error actualizando equipo:", err);
                return res.status(500).json({ message: "Error al actualizar el equipo" });
              }
              return res.json({ message: "Tarea y equipo actualizados a COMPLETADO" });
            }
          );
        } else {
          return res.json({ message: "Tarea actualizada, equipo aún en preparación" });
        }
      });
    });
  });
};

const removeTarea = (req, res) => {
  const { id_equipo_tarea } = req.params;

  tareasModel.deleteTareaEquipo(id_equipo_tarea, (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar tarea' });
    res.json({ message: 'Tarea eliminada correctamente' });
  });
};

module.exports = {
  getTareasByHostname,
  addTarea,
  actualizarPorIdEquipoTarea,
  cambiarEstadoTarea,
  removeTarea
};
