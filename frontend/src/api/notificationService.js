//frontend/src/api/notificationService.js
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_NOTIFICATION_API_URL || 'http://localhost:8083/api';
let socket = null;

export const connectToNotifications = (userId, onNotificationReceived) => {
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8083';
  
  // Desconectar si ya hay una conexión
  if (socket) {
    socket.disconnect();
  }
  
  // Crear nueva conexión
  socket = io(SOCKET_URL);
  
  socket.on('connect', () => {
    console.log('Conectado a Socket.IO');
    socket.emit('join-user-channel', userId);
  });
  
  socket.on('new-notification', (notification) => {
    console.log('Nueva notificación recibida:', notification);
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });
  
  socket.on('connect_error', (error) => {
    console.error('Error de conexión a Socket.IO:', error);
  });
  
  socket.on('disconnect', () => {
    console.log('Desconectado de Socket.IO');
  });
  
  return socket;
};

export const disconnectFromNotifications = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/user/${userId}/unread`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/user/${userId}/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    throw error;
  }
};