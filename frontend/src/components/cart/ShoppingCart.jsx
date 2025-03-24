//frontend/src/components/cart/ShoppingCart.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Divider, 
  Button, 
  Paper, 
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ShoppingCart = ({ 
  cartItems, 
  updateItemQuantity, 
  removeItem, 
  clearCart, 
  seatLocation,
  setSeatLocation,
  handleCheckout 
}) => {
  
  // Calcular subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Validar si el carrito está vacío
  const isCartEmpty = cartItems.length === 0;
  
  // Validar si se puede hacer checkout
  const canCheckout = !isCartEmpty && seatLocation.trim() !== '';

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Carrito de Compras
      </Typography>
      
      {isCartEmpty ? (
        <Typography color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          Tu carrito está vacío
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {cartItems.map((item) => (
            <React.Fragment key={item._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateItemQuantity(item._id, Math.max(1, item.quantity - 1))}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton edge="end" onClick={() => removeItem(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
          Subtotal: ${subtotal.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Ubicación de tu asiento (ej. Sección A, Fila 3, Asiento 12)"
          variant="outlined"
          fullWidth
          value={seatLocation}
          onChange={(e) => setSeatLocation(e.target.value)}
          disabled={isCartEmpty}
          placeholder="Indica dónde te entregaremos tu pedido"
          required
          margin="normal"
        />
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={clearCart}
          disabled={isCartEmpty}
        >
          Vaciar Carrito
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
          disabled={!canCheckout}
          onClick={handleCheckout}
        >
          Realizar Pedido
        </Button>
      </Box>
    </Paper>
  );
};

export default ShoppingCart;