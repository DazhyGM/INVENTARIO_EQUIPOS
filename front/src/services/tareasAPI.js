import axios from 'axios'

const API_URL = 'http://localhost:5000/api/tareas'

export const getTareasByIdEquipo = async (idEquipo) => {
  const res = await axios.get(`${API_URL}/equipo/${idEquipo}`)
  return res.data
}

export const getTareasByHostname = async (hostname) => {
  const res = await axios.get(`${API_URL}/hostname/${hostname}`)
  return res.data
}

export const addTarea = async (idEquipo, tarea) => {
  const res = await axios.post(`${API_URL}/equipo/${idEquipo}`, tarea)
  return res.data
}

export const deleteTarea = async (idTarea) => {
  const res = await axios.delete(`${API_URL}/${idTarea}`)
  return res.data
}

export const updateEstadoTarea = async (idTarea, completada) => {
  const res = await axios.put(`${API_URL}/${idTarea}`, { completada })
  return res.data
}



