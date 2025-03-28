import { useState } from 'react';
import StatusSelector from './StatusSelector';
import { format } from 'date-fns';

function OrderDetails({ order, onStatusUpdate, onClose }) {
  if (!order) return null;
  
  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'bg-gray-500',
      PROCESSING: 'bg-blue-500',
      PREPARING: 'bg-yellow-500',
      ON_THE_WAY: 'bg-orange-500',
      DELIVERED: 'bg-green-500'
    };
    
    const statusTexts = {
      PENDING: 'Pendiente',
      PROCESSING: 'Procesando',
      PREPARING: 'Preparando',
      ON_THE_WAY: 'En Camino',
      DELIVERED: 'Entregado'
    };
    
    return (
      <span className={`${statusColors[status] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
        {statusTexts[status] || status}
      </span>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Detalle del Pedido #{order.id}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Información del Pedido</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">
              <span className="font-medium">Estado:</span> {getStatusBadge(order.status)}
            </p>
            <p className="mb-2">
              <span className="font-medium">Cliente:</span> {order.userId}
            </p>
            <p className="mb-2">
              <span className="font-medium">Ubicación:</span> {order.seatLocation}
            </p>
            <p className="mb-2">
              <span className="font-medium">Método de Pago:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Fecha:</span> {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Resumen del Pedido</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xl font-bold text-primary mb-2">${order.totalAmount.toFixed(2)}</p>
            <p className="mb-2">
              <span className="font-medium">Productos:</span> {order.items?.length || 0}
            </p>
            <p>
              <span className="font-medium">Cantidad total:</span> {
                order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
              } items
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Productos</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">Producto</th>
                <th className="text-center py-2">Precio</th>
                <th className="text-center py-2">Cantidad</th>
                <th className="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3">{item.productName}</td>
                  <td className="text-center py-3">${item.price.toFixed(2)}</td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right py-3 font-bold">Total:</td>
                <td className="text-right py-3 font-bold">${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <StatusSelector 
        order={order} 
        onStatusUpdate={onStatusUpdate} 
      />
    </div>
  );
}

export default OrderDetails;