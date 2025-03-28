import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../services/api';
import OrderTracking from '../components/OrderTracking';

function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError('No pudimos cargar la información del pedido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return <div className="text-center py-8">Cargando información del pedido...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  return <OrderTracking />;
}

export default OrderPage;