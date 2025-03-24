//frontend/src/pages/OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Snackbar, Alert } from '@mui/material';
import ProductList from '../components/products/ProductList';
import ShoppingCart from '../components/cart/ShoppingCart';
import { createOrder } from '../api/orderService';
import { connectToNotifications, disconnectFromNotifications } from '../api/notificationService';

const OrderPage = () => {
  // Estado para los productos en el carrito
  const [cartItems, setCartItems] = useState([]);
  
  // Estado para la ubicación del asiento
  const [seatLocation, setSeatLocation] = useState('');
  
  // Estado para las notificaciones
  const [notification, setNotification] = useState(null);
  
  // ID de usuario simulado (en una aplicación real, vendría del sistema de autenticación)
  const userId = "user123";
  
  // ID de la sede/estadio (en una aplicación real podría ser dinámico)
  const venueId = "venue456";
  
  // Conectar a notificaciones cuando se monta el componente
  useEffect(() => {
    const socket = connectToNotifications(userId, (newNotification) => {
      setNotification({
        message: newNotification.message,
        type: 'success'
      });
    });
    
    // Desconectar cuando se desmonta el componente
    return () => {
      disconnectFromNotifications();
    };
  }, [userId]);
  
  // Agregar un producto al carrito
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      // Comprobar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Actualizar la cantidad si ya existe
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Agregar nuevo item al carrito
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Mostrar notificación
    setNotification({
      message: `${product.name} agregado al carrito`,
      type: 'success'
    });
  };
  
  // Actualizar la cantidad de un producto en el carrito
  const updateItemQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Eliminar un producto del carrito
  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  // Vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Procesar el pedido
  const handleCheckout = async () => {
    try {
      // Preparar datos del pedido
      const orderData = {
        userId,
        venueId,
        seatLocation,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod: "credit_card" // En una aplicación real, se podría seleccionar
      };
      
      // Enviar pedido al servidor
      await createOrder(orderData);
      
      // Limpiar el carrito después de un pedido exitoso
      clearCart();
      setSeatLocation('');
      
      // Mostrar notificación de éxito
      setNotification({
        message: "¡Tu pedido ha sido recibido con éxito! Pronto lo recibirás en tu asiento.",
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      
      // Mostrar notificación de error
      setNotification({
        message: "Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.",
        type: 'error'
      });
    }
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Pedidos en Estadio
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ProductList venueId={venueId} onAddToCart={handleAddToCart} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ShoppingCart 
            cartItems={cartItems}
            updateItemQuantity={updateItemQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
            seatLocation={seatLocation}
            setSeatLocation={setSeatLocation}
            handleCheckout={handleCheckout}
          />
        </Grid>
      </Grid>
      
      {/* Notificaciones */}
      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default OrderPage;