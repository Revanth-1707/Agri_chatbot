// frontend>App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Chatbot from './Components/Chatbot';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Navbar from './Components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #333!important; /* Light black color */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PrivateRoute = ({ path, element: Element, isAuthenticated }) => (
  isAuthenticated ? <Route path={path} element={<Element />} /> : <Navigate to="/login" />
);


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if the user is already authenticated on initial render
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
   // Example state for authentication

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <AppContainer>
      <Routes>
          {!isAuthenticated && <Route path="/" element={<Navigate to="/login" />} />}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
          <Route path="/signup" element={<Signup />} />
          {isAuthenticated && <Route path="/" element={<Chatbot />} />}
      </Routes>
      </AppContainer>
      <ToastContainer />
    </Router>
  );
};

export default App;
