import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import farmBackground from '../assets/Donts_gif_File.gif'; // Import an agriculture-related background image

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
  background-color: #rgba(0, 0, 0, 0.1);
  background-image: url(${farmBackground});
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 400px; /* Set maximum height for the container */
  overflow-y: auto; /* Add scrollbar when content exceeds the maximum height */
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
`;



const Message = styled.div`
  background-color: ${(props) => (props.isUser ? '#007bff' : '#fff')};
  color: ${(props) => (props.isUser ? '#fff' : '#000')};
  border-radius: 12px;
  padding: 10px 15px;
  max-width: 70%;
  align-self: ${(props) => (props.isUser ? 'flex-start' : 'flex-end')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? 'flex-start' : 'flex-end')};
  margin-bottom: 20px;
`;

const MessageTextContainer = styled.div`
  max-width: 70%;
  margin-left: ${(props) => (props.isUser ? '0' : 'auto')};
  margin-right: ${(props) => (props.isUser ? 'auto' : '0')};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  background-color: transparent;
  outline: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
  &:not(:last-child) {
    margin-right: 10px; /* Add margin between buttons */
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the message container whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
  
    try {
      const response = await axios.post('https://agri-chatbot-cyan.vercel.app/chatbot', { message: inputText });
      const botResponse = response.data.message;
  
      // Update the messages state using the functional form of setMessages
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: inputText, isUser: true }, 
        { text: botResponse, isUser: false }
      ]);
      
      setInputText('');
    } catch (error) {
      console.error('Error sending message to backend:', error);
    }
  };
  
  

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <Container ref={messageContainerRef}>
      <Heading>Welcome to our Agricultural Chatbot</Heading>
      <Description>Ask me about agricultural tips, weather, and more!</Description>
      {messages.map((message, index) => (
        <MessageContainer key={index} isUser={message.isUser}>
        <MessageTextContainer isUser={message.isUser}>
          <Message isUser={message.isUser}>{message.text}</Message>
        </MessageTextContainer>
      </MessageContainer>
      
      ))}
      <InputContainer>
        <Input type="text" placeholder="Type your message..." value={inputText} onChange={handleInputChange} onKeyPress={handleKeyPress}/>
        <Button onClick={sendMessage}>Send</Button>
        <Button onClick={clearMessages}>Clear</Button>
      </InputContainer>
    </Container>
  );
};

export default Chatbot;
