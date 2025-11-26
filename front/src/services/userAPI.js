import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
export default API;

export const login = async (email, password) => {
  try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
  } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error;
  }
};