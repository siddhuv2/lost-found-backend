import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, PlusCircle, User, LogOut, Menu, X, ShieldAlert, FileText, CheckCircle } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand">
          <div className="brand-logo-box">
            <Search size={20} className="brand-icon" />
          </div>
          <span className="brand-text">Campus<span className="brand-accent">Find</span></span>
        </Link>

        {isAuthenticated && (
          <nav className="desktop-nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home / Dashboard
            </NavLink>
            <NavLink to="/browse" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Browse Items
            </NavLink>
            <NavLink to="/report-lost" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Report Lost
            </NavLink>
            <NavLink to="/report-found" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Report Found
            </NavLink>
            <NavLink to="/my-reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              My Reports
            </NavLink>
          </nav>
        )}

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="profile-menu-container">
              <button 
                className="profile-btn" 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User profile menu"
              >
                <div className="avatar-circle">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="profile-name">{user?.fullName?.split(' ')[0]}</span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <p className="dropdown-user-name">{user?.fullName}</p>
                    <p className="dropdown-user-dept">{user?.department} • ID: {user?.collegeId}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/my-reports" 
                    className="dropdown-item" 
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FileText size={16} /> My Reports & Claims
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {isAuthenticated ? (
            <div className="mobile-nav-links">
              <Link to="/dashboard" onClick={closeMobile} className="mobile-nav-item">Dashboard</Link>
              <Link to="/browse" onClick={closeMobile} className="mobile-nav-item">Browse Items</Link>
              <Link to="/report-lost" onClick={closeMobile} className="mobile-nav-item">Report Lost Item</Link>
              <Link to="/report-found" onClick={closeMobile} className="mobile-nav-item">Report Found Item</Link>
              <Link to="/my-reports" onClick={closeMobile} className="mobile-nav-item">My Reports</Link>
              <div className="mobile-divider"></div>
              <div className="mobile-user-details">
                <strong>{user?.fullName}</strong>
                <span>{user?.email}</span>
              </div>
              <button onClick={() => { closeMobile(); handleLogout(); }} className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="mobile-auth-links">
              <Link to="/login" onClick={closeMobile} className="btn btn-outline" style={{ width: '100%' }}>Log In</Link>
              <Link to="/register" onClick={closeMobile} className="btn btn-primary" style={{ width: '100%' }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
