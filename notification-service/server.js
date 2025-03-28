//notification-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notificationRoutes = require('./routes/notificationRoutes');
const kafkaConsumer = require('./services/kafkaConsumer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/notifications', notificationRoutes);

// Conexión a MongoDB
const PORT = process.env.PORT || 8083;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stadium-notifications';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor de notificaciones corriendo en puerto ${PORT}`);
      
      // Iniciar el consumidor de Kafka
      kafkaConsumer.connect();
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });