import { useState } from 'react';
import { FaBell, FaUser } from 'react-icons/fa';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-primary">Stadium Delivery - Restaurant Portal</h1>
        
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-primary">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary"
            >
              <div className="bg-gray-200 rounded-full p-2">
                <FaUser size={16} />
              </div>
              <span className="font-medium">Admin</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Perfil</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Configuración</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cerrar Sesión</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;