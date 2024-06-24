import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Lista de Entregas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Cadastrar Entrega
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;