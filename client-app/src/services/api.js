// src/services/api.js
import axios from 'axios';

const inventoryAPI = axios.create({
  baseURL: 'http://localhost:8081/api'
});

const orderAPI = axios.create({
  baseURL: 'http://localhost:8082/api'
});

const notificationAPI = axios.create({
  baseURL: 'http://localhost:8083/api'
});

export const getProducts = async (venueId, filters = {}) => {
  try {
    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    
    // Añadir filtros si están definidos
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    // URL base + parámetros de consulta
    const url = `products/venue/${venueId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await inventoryAPI.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await orderAPI.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await orderAPI.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await orderAPI.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getNotifications = async (userId) => {
  try {
    const response = await notificationAPI.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};