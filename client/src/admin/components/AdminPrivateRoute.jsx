import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
    const adminToken = localStorage.getItem('adminToken');
    return adminToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
//vgfg
export default AdminPrivateRoute;
