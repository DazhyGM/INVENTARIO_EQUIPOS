import axios from 'axios';

const API_URL = 'http://localhost:5000/api/equipo';

export const getEquipos = async () => {
  const response = await axios.get(`${API_URL}/equipo`);
  return response.data;
};

export const searchEquipo = async (nombre) => {
  const response = await axios.get(`${API_URL}/equipo`, {
    params: { nombre }
  });
  return response.data;
};

export const registerEquipo = async (nombre, id_campaña = null) => {
  const response = await axios.post(`${API_URL}/equipo`, {
    nombre,
    id_campaña
  });
  return response.data;
};

export const getCampañas = async () => {
  const response = await axios.get(`${API_URL}/campanias`);
  return response.data;
};

export const asignarCampañaEquipo = async (hostname, id_campaña) => {
  const response = await axios.put(`${API_URL}/asignar-campania/${hostname}`, {
    id_campaña
  });
  return response.data;
};
export const deleteEquipo = async (hostname) => {
  const response = await axios.delete(`${API_URL}/equipo/${hostname}`);
  return response.data;
};
