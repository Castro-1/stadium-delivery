//frontend/src/api/orderService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_ORDER_API_URL || 'http://localhost:8082/api';

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el pedido ${orderId}:`, error);
    throw error;
  }
};