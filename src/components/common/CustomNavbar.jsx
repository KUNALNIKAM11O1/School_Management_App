
import React from 'react';
import { Navbar, Container, Dropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const CustomNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4 sticky-top">
      <Container fluid>
        <Navbar.Brand href="#">
          {/* Brand can be here or mostly in sidebar */}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center border-0 bg-transparent">
              <FaUserCircle size={24} className="me-2 text-primary" />
              <span className="fw-semibold">{user?.name || user?.username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="border-0 shadow">
              <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="text-danger">
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
