import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/api';
import OrderCard from '../components/OrderCard';
import OrderDetails from '../components/OrderDetails';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Filtrar órdenes por estado y término de búsqueda
  useEffect(() => {
    let result = orders;
    
    // Filtrar por estado
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(term) ||
        order.userId.toLowerCase().includes(term) ||
        order.seatLocation.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, selectedStatus, searchTerm]);
  
  const handleStatusUpdate = (orderId, newStatus) => {
    // Actualizar el estado de la orden en el estado local
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  };
  
  const selectedOrder = orders.find(order => order.id === selectedOrderId);
  
  if (loading) {
    return <div className="text-center py-8">Cargando pedidos...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar pedido..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="PREPARING">Preparando</option>
            <option value="ON_THE_WAY">En Camino</option>
            <option value="DELIVERED">Entregado</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              onSelect={setSelectedOrderId}
              isSelected={order.id === selectedOrderId}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No se encontraron pedidos con los filtros seleccionados
          </div>
        )}
      </div>
      
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <OrderDetails
              order={selectedOrder}
              onStatusUpdate={handleStatusUpdate}
              onClose={() => setSelectedOrderId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;