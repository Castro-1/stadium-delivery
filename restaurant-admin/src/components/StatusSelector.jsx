import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateOrderStatus } from '../services/api';
import {
  FaHourglass,
  FaUtensils,
  FaWalking,
  FaCheckCircle
} from 'react-icons/fa';

const statusOptions = [
  { value: 'PROCESSING', label: 'Procesando', icon: FaHourglass, color: 'bg-blue-500' },
  { value: 'PREPARING', label: 'Preparando', icon: FaUtensils, color: 'bg-yellow-500' },
  { value: 'ON_THE_WAY', label: 'En Camino', icon: FaWalking, color: 'bg-orange-500' },
  { value: 'DELIVERED', label: 'Entregado', icon: FaCheckCircle, color: 'bg-green-500' }
];

function StatusSelector({ order, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Pedido #${order.id} actualizado a ${newStatus}`);
      onStatusUpdate(order.id, newStatus);
    } catch (error) {
      toast.error('Error al actualizar el estado del pedido');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const currentIndex = statusOptions.findIndex(option => option.value === order.status);
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Actualizar Estado</h3>
      
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option, index) => {
          const Icon = option.icon;
          const isCurrentStatus = option.value === order.status;
          const isPreviousStatus = index < currentIndex;
          const isNextStatus = index === currentIndex + 1;
          
          return (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isUpdating || isCurrentStatus || (!isPreviousStatus && !isNextStatus && !isPreviousStatus)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                ${isCurrentStatus ? 
                  `${option.color} text-white` : 
                  isPreviousStatus || isNextStatus ? 
                    'bg-white border border-gray-300 hover:bg-gray-50' : 
                    'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Icon size={16} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StatusSelector;