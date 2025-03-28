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

export const getProducts = async (venueId) => {
  try {
    const response = await inventoryAPI.get(`/products/venue/${venueId}`);
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