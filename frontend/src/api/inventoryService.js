//frontend/src/api/inventoryService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_INVENTORY_API_URL || 'http://localhost:8081/api';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

export const getProductsByVenue = async (venueId) => {
  try {
    const response = await axios.get(`${API_URL}/products/venue/${venueId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos para la sede ${venueId}:`, error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos para la categoría ${category}:`, error);
    throw error;
  }
};