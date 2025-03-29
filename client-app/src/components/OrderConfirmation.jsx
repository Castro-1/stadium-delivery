import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

function OrderConfirmation({ orderId, totalAmount, seatLocation }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <FaCheckCircle className="text-green-500 mx-auto mb-4" size={64} />
      
      <h2 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h2>
      <p className="text-gray-600 mb-6">Tu pedido ha sido recibido y está siendo procesado.</p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-700 mb-2">
          <span className="font-bold">Número de Pedido:</span> #{orderId}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-bold">Total:</span> ${totalAmount?.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Ubicación:</span> {seatLocation}
        </p>
      </div>
      
      <p className="text-gray-600 mb-6">
        Te notificaremos cuando tu pedido esté en camino a tu asiento.
      </p>
      
      <Link
        to={`/order/${orderId}`}
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg inline-block"
      >
        Seguir Pedido
      </Link>
    </div>
  );
}

export default OrderConfirmation;