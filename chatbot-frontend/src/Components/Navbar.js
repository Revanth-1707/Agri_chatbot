// frontend>Components>Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Nav = styled.nav`
  background-color: rgba(0, 0, 0, 0.88);
  overflow: hidden;
`;

const NavItem = styled(NavLink)`
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  transition: background-color 0.3s; /* Add transition for smooth color change */
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Change background color on hover */
  }
  &.active {
    background-color: rgba(255, 255, 255, 0.2); /* Change background color when active */
  }
`;

const LogoutButton =styled(NavLink)`
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  transition: background-color 0.3s; /* Add transition for smooth color change */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Change background color on hover */
  }
  `;


const Navbar = ({ isAuthenticated, setIsAuthenticated}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear authentication state (example)
    setIsAuthenticated(false);

    // Perform cleanup tasks (example: remove token from localStorage)
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully!')
    // Redirect the user to the login page (example: using <Navigate>)
    navigate('/login');
    
  };
  
  return (
    <Nav>
      {isAuthenticated && <NavItem to="/" activeClassName="active" exact>Home</NavItem>}
      {!isAuthenticated && <NavItem to="/login" activeClassName="active">Login</NavItem>}
      {!isAuthenticated && <NavItem to="/signup" activeClassName="active">Signup</NavItem>}
      {isAuthenticated && <LogoutButton onClick={handleLogout} activeClassName=""> Sign out</LogoutButton>}
    </Nav>
  );
};

export default Navbar;
