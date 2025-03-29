import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="text-secondary font-bold">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-lg text-white ${
              product.stock > 0 ? 'bg-primary hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;