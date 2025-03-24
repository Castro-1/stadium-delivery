//notification-service/services/notificationService.js
const Notification = require('../models/Notification');

// Corregir la forma en que se accede a Socket.io
exports.sendRealTimeNotification = (notification) => {
  try {
    // Almacenar la referencia a io cuando se inicializa el servidor
    const io = global.io;
    
    if (io) {
      const userChannel = `user-${notification.userId}`;
      io.to(userChannel).emit('new-notification', notification);
      console.log(`Notificación enviada al canal: ${userChannel}`);
    } else {
      console.error('Socket.io no está disponible');
    }
  } catch (error) {
    console.error('Error al enviar notificación en tiempo real:', error);
  }
};

// Obtener notificaciones por usuario
exports.getUserNotifications = async (userId) => {
  return await Notification.find({ userId })
    .sort({ timestamp: -1 });
};

// Obtener notificaciones no leídas por usuario
exports.getUnreadNotifications = async (userId) => {
  return await Notification.find({ userId, read: false })
    .sort({ timestamp: -1 });
};

// Marcar notificación como leída
exports.markAsRead = async (notificationId) => {
  const notification = await Notification.findById(notificationId);
  
  if (!notification) {
    throw new Error('Notificación no encontrada');
  }
  
  notification.read = true;
  return await notification.save();
};