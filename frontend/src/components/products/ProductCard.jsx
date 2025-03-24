//frontend/src/components/products/ProductCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart }) => {
  const { _id, name, description, price, stock, category, imageUrl } = product;
  
  const isOutOfStock = stock <= 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl || 'https://via.placeholder.com/300x200?text=Producto'}
        alt={name}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {name}
          </Typography>
          <Chip
            label={`$${price.toFixed(2)}`}
            color="primary"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Chip
          label={category}
          size="small"
          variant="outlined"
          sx={{ mb: 1 }}
        />
        
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color={isOutOfStock ? 'error' : 'text.secondary'}>
            {isOutOfStock ? 'Agotado' : `Stock: ${stock}`}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button
          startIcon={<AddShoppingCartIcon />}
          variant="contained"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;