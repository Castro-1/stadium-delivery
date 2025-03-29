const axios = require("axios");
const Notification = require("../models/Notification");

// Procesar notificación por tipo
exports.processNotification = async (notification) => {
  try {
    console.log(
      `Notificación procesada para usuario: ${notification.userId}, tipo: ${notification.type}`
    );
    return notification;
  } catch (error) {
    console.error("Error al procesar notificación:", error);
    throw error;
  }
};

// Guardar notificación de cambio de estado
exports.saveStatusNotification = async (orderId, userId, status) => {
  try {
    let message = '';
    
    switch (status) {
      case 'PROCESSING':
        message = `Tu pedido #${orderId} ha sido recibido y está siendo procesado.`;
        break;
      case 'PREPARING':
        message = `¡Tu pedido #${orderId} está siendo preparado!`;
        break;
      case 'ON_THE_WAY':
        message = `¡Tu pedido #${orderId} está en camino a tu asiento!`;
        break;
      case 'DELIVERED':
        message = `¡Tu pedido #${orderId} ha sido entregado! ¡Buen provecho!`;
        break;
      default:
        message = `El estado de tu pedido #${orderId} ha cambiado a ${status}.`;
    }
    
    const notification = new Notification({
      userId,
      type: "ORDER_STATUS_UPDATE",
      message,
      orderId
    });
    
    const savedNotification = await notification.save();
    console.log(`Notificación guardada: Pedido #${orderId} - ${status}`);
    return savedNotification;
  } catch (error) {
    console.error(`Error al guardar notificación de estado ${status}:`, error);
    throw error;
  }
};

// Obtener notificaciones por usuario
exports.getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ timestamp: -1 });
};

// Obtener notificaciones no leídas por usuario
exports.getUnreadNotifications = async (userId) => {
  return await Notification.find({ userId, read: false }).sort({
    timestamp: -1,
  });
};

// Marcar notificación como leída
exports.markAsRead = async (notificationId) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new Error("Notificación no encontrada");
  }

  notification.read = true;
  return await notification.save();
};

// Marcar todas las notificaciones de un usuario como leídas
exports.markAllAsRead = async (userId) => {
  return await Notification.updateMany({ userId, read: false }, { read: true });
};