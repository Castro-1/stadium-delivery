// inventory-service/scripts/seed-data.js
require('dotenv').config();
const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stadium-inventory';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Definir el esquema de producto
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  imageUrl: String,
  venueId: String,
  vendorId: String
});

const Product = mongoose.model('Product', productSchema);

// Productos de ejemplo
const sampleProducts = [
  {
    name: 'Hamburguesa Clásica',
    description: 'Deliciosa hamburguesa con carne, lechuga, tomate y queso',
    price: 10.99,
    stock: 50,
    category: 'Comidas',
    imageUrl: 'https://placehold.co/300x200?text=Hamburguesa',
    venueId: 'venue456',
    vendorId: 'vendor123'
  },
  {
    name: 'Hot Dog Jumbo',
    description: 'Hot dog extra grande con salchicha premium',
    price: 8.99,
    stock: 60,
    category: 'Comidas',
    imageUrl: 'https://placehold.co/300x200?text=HotDog',
    venueId: 'venue456',
    vendorId: 'vendor123'
  },
  {
    name: 'Nachos con Queso',
    description: 'Crujientes nachos con queso derretido',
    price: 7.50,
    stock: 40,
    category: 'Snacks',
    imageUrl: 'https://placehold.co/300x200?text=Nachos',
    venueId: 'venue456',
    vendorId: 'vendor124'
  },
  {
    name: 'Refresco Grande',
    description: 'Refresco de cola grande con hielo',
    price: 4.50,
    stock: 100,
    category: 'Bebidas',
    imageUrl: 'https://placehold.co/300x200?text=Refresco',
    venueId: 'venue456',
    vendorId: 'vendor125'
  },
  {
    name: 'Cerveza',
    description: 'Cerveza fría de 330ml',
    price: 6.00,
    stock: 80,
    category: 'Bebidas',
    imageUrl: 'https://placehold.co/300x200?text=Cerveza',
    venueId: 'venue456',
    vendorId: 'vendor125'
  },
  {
    name: 'Pizza Personal',
    description: 'Pizza de queso y pepperoni tamaño personal',
    price: 9.99,
    stock: 45,
    category: 'Comidas',
    imageUrl: 'https://placehold.co/300x200?text=Pizza',
    venueId: 'venue456',
    vendorId: 'vendor126'
  },
  {
    name: 'Palomitas Grandes',
    description: 'Palomitas de maíz recién hechas',
    price: 5.50,
    stock: 70,
    category: 'Snacks',
    imageUrl: 'https://placehold.co/300x200?text=Palomitas',
    venueId: 'venue456',
    vendorId: 'vendor127'
  },
  {
    name: 'Agua Mineral',
    description: 'Agua mineral de 500ml',
    price: 3.00,
    stock: 120,
    category: 'Bebidas',
    imageUrl: 'https://placehold.co/300x200?text=Agua',
    venueId: 'venue456',
    vendorId: 'vendor125'
  }
];

// Cargar datos a la base de datos
const seedDatabase = async () => {
  try {
    // Eliminar productos existentes
    await Product.deleteMany({});
    console.log('Productos existentes eliminados');
    
    // Insertar nuevos productos
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} productos insertados correctamente`);
    
    // Cerrar la conexión
    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('Error al cargar datos de prueba:', error);
    mongoose.connection.close();
  }
};

// Ejecutar la función de carga de datos
seedDatabase();