const Product = require('../models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener productos por categoría
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener productos por sede con filtros
exports.getProductsByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { 
      name, 
      category, 
      minPrice, 
      maxPrice, 
      inStock,
      sortBy,
      sortOrder
    } = req.query;
    
    // Construir filtro
    const filter = { venueId };
    
    // Filtro por nombre (búsqueda parcial, insensible a mayúsculas/minúsculas)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Filtro por categoría
    if (category) {
      filter.category = category;
    }
    
    // Filtro por rango de precios
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    
    // Filtro por disponibilidad de stock
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      filter.stock = { $lte: 0 };
    }
    
    // Opciones de ordenamiento
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Ordenamiento por defecto
      sortOptions.name = 1;
    }
    
    const products = await Product.find(filter).sort(sortOptions);
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar stock de un producto
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.query;
    
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Se requiere especificar la cantidad' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    product.stock = quantity;
    product.updatedAt = Date.now();
    await product.save();
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};