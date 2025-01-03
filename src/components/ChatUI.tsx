import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, List, TextField, Button, Typography } from '@mui/material';
import Message from './Message';
import ServiceToggle from './ServiceToggle';
import { fetchAIResponse } from '../services/apiService';
import { ChatUIProps } from '../utils/types';


const ChatUI: React.FC<ChatUIProps> = ({ session, onMessagesUpdate }) => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>(session?.messages || []);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [aiService, setAiService] = useState(session?.aiService || 'OpenAI');
    const [model, setModel] = useState(session?.model || 'gpt-4o');
    const messagesEndRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        setMessages(session?.messages || []);
        setAiService(session?.aiService || 'OpenAI');
        setModel(session?.model || 'gpt-4o');
    }, [session, aiService, model]);

    // Auto scroll
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleServiceChange = (newService: string) => {
        setAiService(newService);
    
        // Update the AI service in the session object
        if (session) {
          session.aiService = newService;
    
          // Update the session in localStorage
          const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');
          savedSessions[session.id] = { ...savedSessions[session.id], aiService: newService };
          localStorage.setItem('chatSessions', JSON.stringify(savedSessions));
        }
      };

      const handleModelChange = (newModel: string) => {
        setModel(newModel);
    
        if (session) {
          session.model = newModel;
    
          // Update session in localStorage
          const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
          savedSessions[session.id] = { ...savedSessions[session.id], model: newModel };
          localStorage.setItem('chatSessions', JSON.stringify(savedSessions));
        }
      };

    const handleAIResponse = async (message: string) => {
        setIsTyping(true); 
        let aiResponse = ''; 

        // Add an empty AI message to the chat (which we'll update as we get the response)
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);
        
        const chatHistory = [...messages, { role: 'user', content: message }];

        // Fetch full response from the fetchAIResponse function
        const fullResponse = await fetchAIResponse(chatHistory, aiService, model);

        //Typing effect logic
        for (let i = 0; i < fullResponse.length; i++) {
            aiResponse += fullResponse[i];
        setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', content: aiResponse }]); 

        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate typing delay
        }
       
        setIsTyping(false); 
        return fullResponse;
    };

    const handleSendMessage = useCallback(async () => {
        if(userInput.trim()) {
            const newMessage = { role: 'user', content: userInput };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setUserInput('');
            const aiResponse = await handleAIResponse(userInput);
            const updatedWithAI = [...updatedMessages, { role: 'assistant', content: aiResponse }];
            setMessages(updatedWithAI);
            onMessagesUpdate(updatedWithAI); 
        }
        
    }, [userInput]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%" overflow-y="auto">

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '15px', borderBottom: '1px solid #ccc', marginTop: '20px' }}>
          <Typography >
            Chat Title
          </Typography>
          <ServiceToggle
          selectedService={aiService}
          setAiService={handleServiceChange}
          selectedModel={model}
          setModel={handleModelChange}
        />        
        </Box>

      {/* Message Area */}
      <Box flexGrow={1} padding={2} bgcolor="#f0f0f0" overflow="auto">
        <List>
          {messages.map((msg, index) => (
            <Message 
            key={index} 
            role={msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'assistant'} // Default to 'assistant' if invalid
            content={msg.content} 
            />
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Area */}
      <Box display="flex" padding={2} bgcolor="#f0f0f0" borderTop="1px solid #ccc">
        <TextField
        sx={{
            borderRadius: '25px', 
            backgroundColor: '#fff', 
            '.MuiOutlinedInput-root': {
              borderRadius: '25px',
              padding: '10px 20px', 
            },
            input: {
              padding: '10px 20px', 
            },
          }}
          fullWidth
          variant="outlined"
          placeholder="Enter your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        
        <Button 
          sx={{ borderRadius: '25px', marginLeft: '10px' }}
          variant="contained" 
          color="primary" 
          onClick={handleSendMessage} 
          disabled={isTyping} 
        >
          Send
        </Button>
      </Box>
    </Box>
  );

};

export default ChatUI;
