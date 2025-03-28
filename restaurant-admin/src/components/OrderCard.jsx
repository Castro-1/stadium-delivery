import { useState } from 'react';
import StatusSelector from './StatusSelector';
import { format } from 'date-fns';

function OrderCard({ order, onStatusUpdate, onSelect, isSelected }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-500';
      case 'PROCESSING':
        return 'bg-blue-500';
      case 'PREPARING':
        return 'bg-yellow-500';
      case 'ON_THE_WAY':
        return 'bg-orange-500';
      case 'DELIVERED':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
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
        return 'En Camino';
      case 'DELIVERED':
        return 'Entregado';
      default:
        return status;
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => onSelect(order.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
            <p className="text-gray-600 text-sm">
              Cliente: {order.userId}
            </p>
            <p className="text-gray-600 text-sm">
              Ubicación: {order.seatLocation}
            </p>
            <p className="text-gray-600 text-sm">
              Fecha: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`text-white px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            <p className="font-bold mt-2">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-primary text-sm mt-2 hover:underline"
        >
          {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-2">
          <h4 className="font-medium mb-2">Productos:</h4>
          <ul className="space-y-2">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between font-bold">
            <span>Total:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          
          <StatusSelector 
            order={order} 
            onStatusUpdate={onStatusUpdate} 
          />
        </div>
      )}
    </div>
  );
}

export default OrderCard;
