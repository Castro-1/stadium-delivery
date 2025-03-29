import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import OrderManagement from './pages/OrderManagement'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
