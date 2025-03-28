import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaClipboardList, 
  FaBoxOpen, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="w-64 bg-primary text-white min-h-screen shadow-md">
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-2xl font-bold">Restaurant Admin</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-800'
                }`
              }
            >
              <FaHome className="mr-3" size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-800'
                }`
              }
            >
              <FaClipboardList className="mr-3" size={18} />
              <span>Órdenes</span>
            </NavLink>
          </li>
          
          
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-800">
              <FaSignOutAlt className="mr-3" size={18} />
              <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
