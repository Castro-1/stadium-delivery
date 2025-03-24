//notification-service/controllers/notificationController.js
const notificationService = require('../services/notificationService');

// Obtener notificaciones de un usuario
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener notificaciones no leídas de un usuario
exports.getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUnreadNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marcar una notificación como leída
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marcar todas las notificaciones de un usuario como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas', count: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
