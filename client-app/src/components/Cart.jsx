import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    seatLocation, 
    setSeatLocation, 
    updateItemQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItems,
    clearCart 
  } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const handleQuantityChange = (productId, newQuantity) => {
    updateItemQuantity(productId, newQuantity);
  };
  
  const handleCheckout = async () => {
    if (!seatLocation) {
      toast.error('Por favor ingresa tu ubicación');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Agrega productos a tu carrito para continuar');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: "user123", // En un app real esto vendría de la autenticación
        venueId: "venue456",
        seatLocation,
        items: getCartItems(),
        paymentMethod
      };
      
      const order = await createOrder(orderData);
      clearCart();
      toast.success('¡Pedido creado exitosamente!');
      navigate(`/order/${order.id}`);
    } catch (error) {
      toast.error('Error al procesar el pedido');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
        <p className="text-gray-500">No hay productos en tu carrito</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center">
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md mr-4" 
              />
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-600 text-sm">${item.product.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                className="text-gray-500 hover:text-primary"
              >
                <FaMinus size={14} />
              </button>
              
              <span className="mx-2 w-8 text-center">{item.quantity}</span>
              
              <button
                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                className="text-gray-500 hover:text-primary"
              >
                <FaPlus size={14} />
              </button>
              
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="seatLocation">
          Ubicación (Sección y Asiento) *
        </label>
        <input
          id="seatLocation"
          type="text"
          placeholder="Ej: Sección A, Asiento 12"
          value={seatLocation}
          onChange={(e) => setSeatLocation(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Método de Pago</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="cash">Efectivo</option>
        </select>
      </div>
      
      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>Total:</span>
        <span>${getCartTotal().toFixed(2)}</span>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={isProcessing || !seatLocation}
        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
      </button>
    </div>
  );
}

export default Cart;