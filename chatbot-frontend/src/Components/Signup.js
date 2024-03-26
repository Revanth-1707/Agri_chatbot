import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%; /* Increase the width of the container */
  max-width: 800px; /* Maximum width */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.4);;
  color: white;
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
  color:white;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  background-color: white;
  border-radius:8px;
  color: black;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: green;
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

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/signup', { email, password });
      console.log(response.data);
      navigate('/');
      toast.success('Successfully created account. Now you can login using your credentials.');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.response.status === 409 && error.response.data.message === 'Email already exists') {
        toast.error('Email is already in use. Please use a different email.');
      } else {
        toast.error('Email is already in use. Please use a different email.');
      }
    }
  };

  return (
    <Container>
      <h2>Create an account</h2>
      <InputContainer>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </InputContainer>
      <InputContainer>
      <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ShowPasswordButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide' : 'Show'} Password
        </ShowPasswordButton>
      </InputContainer>
      <Button onClick={handleSignup}>Signup</Button>
    </Container>
  );
};

export default Signup;
