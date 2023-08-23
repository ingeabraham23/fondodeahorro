import { Link } from 'react-router-dom';
import './Navbar.css';

import {
    faCalendar, faCloudArrowUp, faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navigationItems = [
  { path: '/calendario', icon: faCalendar, label: 'Calendario' },
  { path: '/registro', icon: faCalendar, label: 'Registro' },
  { path: '/reporte', icon: faTableCells, label: 'Reporte' },
  { path: '/respaldo', icon: faCloudArrowUp, label: 'Respaldo' },
];

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        {navigationItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link to={item.path} className="nav-link">
              <FontAwesomeIcon icon={item.icon} size="2x" style={{ fontSize: '24px' }}/> {/* Renderiza el icono de Font Awesome */}
              <p className='text-small'>{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;