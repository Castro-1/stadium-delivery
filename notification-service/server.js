//notification-service/server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notificationRoutes = require('./routes/notificationRoutes');
const kafkaConsumer = require('./services/kafkaConsumer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

global.io = io;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join-user-channel', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Socket ${socket.id} se unió al canal del usuario ${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Hacer disponible io para otros módulos
app.set('io', io);

// Rutas
app.use('/api/notifications', notificationRoutes);

// Conexión a MongoDB
const PORT = process.env.PORT || 8083;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/stadium-notifications';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    server.listen(PORT, () => {
      console.log(`Servidor de notificaciones corriendo en puerto ${PORT}`);
      
      // Iniciar el consumidor de Kafka
      kafkaConsumer.connect();
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });