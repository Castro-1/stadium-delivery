//inventory-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/products', productRoutes);

// Conexión a MongoDB
const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stadium-inventory';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor de inventario corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });