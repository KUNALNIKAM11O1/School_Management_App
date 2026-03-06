
import React from 'react';
import Sidebar from './Sidebar';
import CustomNavbar from './CustomNavbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content w-100">
        <CustomNavbar />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
