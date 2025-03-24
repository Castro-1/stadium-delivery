//frontend/src/components/products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { getProductsByVenue } from '../../api/inventoryService';
import ProductCard from './ProductCard';
import { Container, Grid, Typography, CircularProgress, Box, TextField, MenuItem } from '@mui/material';

const ProductList = ({ venueId, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByVenue(venueId);
        setProducts(data);
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [venueId]);

  // Filtrar productos por categoría y término de búsqueda
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Productos Disponibles
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            select
            label="Categoría"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">Todas las categorías</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Buscar productos"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Grid>
          ))
        ) : (
          <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Typography>No se encontraron productos que coincidan con tu búsqueda.</Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default ProductList;