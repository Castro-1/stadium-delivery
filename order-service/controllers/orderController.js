//order-service/controllers/orderController.js
const axios = require('axios');
const { Order, OrderItem } = require('../models');
const { sendMessage } = require('../services/kafkaProducer');

// Crear un nuevo pedido
exports.createOrder = async (req, res) => {
  try {
    const { userId, venueId, seatLocation, items, paymentMethod } = req.body;
    
    if (!userId || !venueId || !seatLocation || !items || !items.length || !paymentMethod) {
      return res.status(400).json({ message: 'Faltan datos requeridos para el pedido' });
    }
    
    // Crear el pedido
    const order = await Order.create({
      userId,
      venueId,
      seatLocation,
      paymentMethod,
      status: 'PENDING'
    });
    
    // Procesar cada item del pedido
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      try {
        // Obtener información del producto desde el servicio de inventario
        const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8081';
        const response = await axios.get(`${inventoryServiceUrl}/api/products/${item.productId}`);
        const product = response.data;
        
        // Crear el item del pedido
        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          productName: product.name,
          price: product.price,
          quantity: item.quantity
        });
        
        orderItems.push(orderItem);
        totalAmount += product.price * item.quantity;
        
        // Actualizar stock en el servicio de inventario
        await axios.put(
          `${inventoryServiceUrl}/api/products/${item.productId}/stock?quantity=${product.stock - item.quantity}`
        );
      } catch (error) {
        console.error('Error al procesar item del pedido:', error);
      }
    }
    
    // Actualizar el monto total del pedido
    order.totalAmount = totalAmount;
    await order.save();
    
    // Publicar evento de pedido creado
    await sendMessage('order-events', {
      eventType: 'ORDER_CREATED',
      orderId: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      seatLocation: order.seatLocation
    });
    
    // Obtener el pedido completo con sus items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.status(201).json(completeOrder);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
  }
};

// Obtener todos los pedidos
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener pedidos por usuario
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar el estado de un pedido
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Se requiere especificar el nuevo estado' });
    }
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    order.status = status;
    await order.save();
    
    // Publicar evento de cambio de estado
    await sendMessage('order-events', {
      eventType: 'ORDER_STATUS_CHANGED',
      orderId: order.id,
      userId: order.userId,
      newStatus: status,
      seatLocation: order.seatLocation,
      totalAmount: order.totalAmount
    });
    
    // Obtener el pedido actualizado con sus items
    const updatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};