// src/components/OrderTracking.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../services/api';
import { FaCheckCircle, FaHourglass, FaUtensils, FaWalking, FaBoxOpen } from 'react-icons/fa';

function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchOrder = async () => {
    try {
      const data = await getOrder(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('No pudimos cargar la información del pedido');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Cargar inicialmente
    fetchOrder();
    
    // Configurar intervalo para actualizar cada 5 segundos
    const pollingInterval = setInterval(fetchOrder, 3000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(pollingInterval);
  }, [orderId]);
  
  if (loading && !order) {
    return <div className="text-center py-8">Cargando información del pedido...</div>;
  }
  
  if (error && !order) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  if (!order) return null;
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaHourglass className="text-yellow-500" size={24} />;
      case 'PROCESSING':
        return <FaHourglass className="text-blue-500" size={24} />;
      case 'PREPARING':
        return <FaUtensils className="text-blue-500" size={24} />;
      case 'ON_THE_WAY':
        return <FaWalking className="text-blue-500" size={24} />;
      case 'DELIVERED':
        return <FaCheckCircle className="text-green-500" size={24} />;
      default:
        return <FaBoxOpen className="text-gray-500" size={24} />;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'Procesando';
      case 'PREPARING':
        return 'Preparando';
      case 'ON_THE_WAY':
        return 'En camino';
      case 'DELIVERED':
        return 'Entregado';
      default:
        return status;
    }
  };
  
  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Tu pedido está siendo recibido';
      case 'PROCESSING':
        return 'Tu pedido ha sido confirmado y está siendo procesado';
      case 'PREPARING':
        return 'Tu pedido está siendo preparado por nuestro equipo';
      case 'ON_THE_WAY':
        return 'Tu pedido está en camino a tu asiento';
      case 'DELIVERED':
        return '¡Tu pedido ha sido entregado!';
      default:
        return '';
    }
  };
  
  const isCompleted = (orderStatus, stepStatus) => {
    const statusOrder = ['PENDING', 'PROCESSING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED'];
    const orderIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    return orderIndex >= stepIndex;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Seguimiento de Pedido #{orderId}</h2>
      <p className="text-gray-600 mb-6">Ubicación: {order.seatLocation}</p>
      
      <div className="mb-8">
        <div className="flex items-center mb-2">
          {getStatusIcon(order.status)}
          <h3 className="text-xl font-bold ml-2">
            {getStatusText(order.status)}
          </h3>
        </div>
        <p className="text-gray-600">{getStatusDescription(order.status)}</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-full ${isCompleted(order.status, 'PROCESSING') ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center mr-4`}>
            <span className="text-white font-bold">1</span>
          </div>
          <div>
            <h4 className="font-medium">Pedido Recibido</h4>
            <p className="text-sm text-gray-600">Tu pedido ha sido recibido y confirmado</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-full ${isCompleted(order.status, 'PREPARING') ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center mr-4`}>
            <span className="text-white font-bold">2</span>
          </div>
          <div>
            <h4 className="font-medium">Preparación</h4>
            <p className="text-sm text-gray-600">Tu pedido está siendo preparado</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-full ${isCompleted(order.status, 'ON_THE_WAY') ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center mr-4`}>
            <span className="text-white font-bold">3</span>
          </div>
          <div>
            <h4 className="font-medium">En Camino</h4>
            <p className="text-sm text-gray-600">Tu pedido está en camino a tu asiento</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-full ${isCompleted(order.status, 'DELIVERED') ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center mr-4`}>
            <span className="text-white font-bold">4</span>
          </div>
          <div>
            <h4 className="font-medium">Entregado</h4>
            <p className="text-sm text-gray-600">Tu pedido ha sido entregado. ¡Buen provecho!</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="font-bold text-lg mb-4">Detalles del Pedido</h3>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">x{item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between font-bold text-lg mt-6">
          <span>Total:</span>
          <span>${order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;