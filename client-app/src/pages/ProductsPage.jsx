import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showInStock, setShowInStock] = useState(true);
  const [sortConfig, setSortConfig] = useState({ field: 'name', order: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      // Si la categoría es 'Todos', no la enviamos como filtro
      const categoryFilter = selectedCategory !== 'Todos' ? selectedCategory : null;
      
      // Construir los filtros para la API
      const apiFilters = {
        name: searchTerm || undefined,
        category: categoryFilter,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        inStock: showInStock ? 'true' : undefined,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order
      };
      
      const data = await getProducts('venue456', apiFilters);
      setProducts(data);
      
      // Extraer categorías únicas si estamos cargando sin filtro de categoría
      if (!categoryFilter) {
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };
  
  // Efecto inicial para cargar productos
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Efecto para aplicar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce para evitar muchas llamadas API
    
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, priceRange, showInStock, sortConfig]);
  
  // Manejador para cambiar el orden
  const handleSort = (field) => {
    setSortConfig(prevSort => ({
      field,
      order: prevSort.field === field && prevSort.order === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Renderizar ícono de ordenamiento
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return <FaSort />;
    return sortConfig.order === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  // Manejar cambios en el rango de precios
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  if (loading && products.length === 0) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }
  
  if (error && products.length === 0) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Menú del Estadio</h1>
          
          {/* Barra de búsqueda */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro de categorías */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Todos">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Filtro de precio mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Min"
                />
              </div>
              
              {/* Filtro de precio máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Max"
                />
              </div>
              
              {/* Filtro de disponibilidad */}
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={() => setShowInStock(!showInStock)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-sm font-medium text-gray-700">Solo productos disponibles</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Opciones de ordenamiento */}
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center px-3 py-1 rounded ${
                sortConfig.field === 'name' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              Nombre {renderSortIcon('name')}
            </button>
            <button
              onClick={() => handleSort('price')}
              className={`flex items-center px-3 py-1 rounded ${
                sortConfig.field === 'price' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              Precio {renderSortIcon('price')}
            </button>
          </div>
          
          {/* Lista de productos */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <p className="text-gray-600">No se encontraron productos con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <Cart />
      </div>
    </div>
  );
}

export default ProductsPage;