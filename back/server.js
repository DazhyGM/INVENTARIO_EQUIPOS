require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const tareasRoutes = require('./routes/tareasRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

app.use('/api/users', userRoutes);
app.use('/api/equipo', equipoRoutes);
app.use('/api/tareas', tareasRoutes);

app.get('/api/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { JWT_SECRET };
