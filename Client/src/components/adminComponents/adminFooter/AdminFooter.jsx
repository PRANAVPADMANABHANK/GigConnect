import React from 'react';
import './AdminFooter.scss';

const AdminFooter = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <ul className="sidebar-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/">Users</a></li>
        <li><a href="/">Products</a></li>
        <li><a href="/">Settings</a></li>
      </ul>
    </aside>
  );
};

export default AdminFooter;
