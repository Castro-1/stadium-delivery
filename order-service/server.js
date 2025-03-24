//order-service/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/orders', orderRoutes);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 8082;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos conectada y sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor de pedidos corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });