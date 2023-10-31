import { Link } from 'react-router-dom';
import './Navbar.css';

import {
    faCalendar, faCloudArrowUp, faMoneyBillTrendUp, faMoneyCheckDollar, faPlusCircle, faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navigationItems = [
  { path: '/', icon: faCalendar, label: 'Calendario' },
  { path: '/registro', icon: faPlusCircle, label: 'Registro' },
  { path: '/reporte', icon: faTableCells, label: 'Reporte' },
  { path: '/respaldo', icon: faCloudArrowUp, label: 'Respaldo' },
  { path: '/calculos', icon: faMoneyBillTrendUp, label: 'Calculos' },
  { path: '/pagos', icon: faMoneyCheckDollar, label: 'Pagos' },
];

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        {navigationItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link to={item.path} className="nav-link">
              <FontAwesomeIcon icon={item.icon} size="2x" style={{ fontSize: '24px' }}/> {/* Renderiza el icono de Font Awesome */}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;