import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%; /* Increase the width of the container */
  max-width: 800px; /* Maximum width */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.4);
  color:white:
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 400px; /* Set maximum height for the container */
  text-align: center;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
  width:95%;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid grey; /* Set border color */
  border-radius: 8px;
  background-color: white; /* Make the background transparent */
  color: black; /* Set text color to white */
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: rgba(0, 128, 0, 0.8);;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ShowPasswordButton = styled.button`
  background-color: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
`;

const Login = ({ setIsAuthenticated, isAuthenticated}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is already authenticated on initial render
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [setIsAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      console.log(response.data);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
      toast.success('Welcome! You have successfully logged in.'); 
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const LoginTitle = styled.h2`
  color: white; /* Set the text color to white */
`;

  return (
    <Container>
      <LoginTitle>Login</LoginTitle>
      <InputContainer>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </InputContainer>
      <InputContainer>
      <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ShowPasswordButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide' : 'Show'} Password
        </ShowPasswordButton>
      </InputContainer>
      <Button onClick={handleLogin}>Login</Button>
    </Container>
  );
};

export default Login;
