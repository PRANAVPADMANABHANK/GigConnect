import React from 'react';
import './AdminNavbar.scss';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="logo">Admin</div>
      <ul className="nav-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/">Users</a></li>
        <li><a href="/">Products</a></li>
        <li><a href="/">Settings</a></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
