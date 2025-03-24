//order-service/models/index.js
const sequelize = require('../config/database');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Definir relaciones
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
  sequelize,
  Order,
  OrderItem
};