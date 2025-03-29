import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/api';
import { format } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  if (loading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  // Calcular estadísticas
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const pendingOrders = orders.filter(order => 
    order.status === 'PENDING' || order.status === 'PROCESSING'
  ).length;
  
  const preparingOrders = orders.filter(order => order.status === 'PREPARING').length;
  const inDeliveryOrders = orders.filter(order => order.status === 'ON_THE_WAY').length;
  const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;
  
  // Datos para los gráficos
  const statusChartData = {
    labels: ['Pendientes', 'Preparando', 'En Camino', 'Entregados'],
    datasets: [
      {
        label: 'Pedidos por Estado',
        data: [pendingOrders, preparingOrders, inDeliveryOrders, completedOrders],
        backgroundColor: [
          '#3B82F6',
          '#F59E0B',
          '#FB923C',
          '#10B981'
        ]
      }
    ]
  };
  
  // Agrupar pedidos por fecha
  const ordersByDate = orders.reduce((acc, order) => {
    const date = format(new Date(order.createdAt), 'dd/MM');
    if (!acc[date]) {
      acc[date] = {
        count: 0,
        revenue: 0
      };
    }
    
    acc[date].count += 1;
    acc[date].revenue += order.totalAmount;
    
    return acc;
  }, {});
  
  const dates = Object.keys(ordersByDate).sort();
  
  const revenueChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Ingresos',
        data: dates.map(date => ordersByDate[date].revenue),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  const ordersChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Cantidad de Pedidos',
        data: dates.map(date => ordersByDate[date].count),
        backgroundColor: '#10B981'
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Pedidos Totales</h3>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Ingresos</h3>
          <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Valor Promedio</h3>
          <p className="text-3xl font-bold mt-2">${averageOrderValue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Pendientes</h3>
          <p className="text-3xl font-bold mt-2">{pendingOrders + preparingOrders}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-xl font-medium mb-4">Ingresos por Día</h3>
          <div className="h-64">
            <Line data={revenueChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-medium mb-4">Pedidos por Estado</h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={statusChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-medium mb-4">Cantidad de Pedidos por Día</h3>
        <div className="h-64">
          <Bar data={ordersChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;