import axios from 'axios';

const orderAPI = axios.create({
  baseURL: 'http://localhost:8082/api'
});

const inventoryAPI = axios.create({
  baseURL: 'http://localhost:8081/api'
});

export const getAllOrders = async () => {
  try {
    const response = await orderAPI.get('/orders');
    return response.data.filter(order => order.status !== 'PENDING');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await orderAPI.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await orderAPI.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getProductsByVenue = async (venueId) => {
  try {
    const response = await inventoryAPI.get(`/products/venue/${venueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProductStock = async (productId, quantity) => {
  try {
    const response = await inventoryAPI.put(`/products/${productId}/stock`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};
