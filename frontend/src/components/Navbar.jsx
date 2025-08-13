import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, token } = useAuth();

  const handleLogout = async () => {
    try {
      if (token) {
        await authAPI.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout?.()
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-links-container">
        <ul className="navbar-list" style={{ display: 'flex', justifyContent: 'space-between'}}>
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/settings" className="navbar-link">
              Settings
            </Link>
          </li>
          <li className="navbar-item" style={{ marginLeft: 'auto' }}>
            <button onClick={handleLogout} className="logout-button" data-testid="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

