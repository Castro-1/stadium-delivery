// App.jsx
import { Routes, Route } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import OrderPage from './pages/OrderPage'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App