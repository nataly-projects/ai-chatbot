import React, { useState, useEffect, useCallback } from 'react';
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

    useEffect(() => {
        console.log('session: ', session);
        setMessages(session?.messages || []);
        setAiService(session?.aiService || 'OpenAI');
        setModel(session?.model || 'gpt-4o');
    }, [session, aiService, model]);

    const handleServiceChange = (newService: string) => {
        setAiService(newService);
    
        // Update the AI service in the session object
        if (session) {
          session.aiService = newService;
    
          // Update the session in localStorage
          const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
          const updatedSessions = savedSessions.map((s: typeof session) =>
            s.id === session.id ? { ...s, aiService: newService } : s
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        }
      };

      const handleModelChange = (newModel: string) => {
        console.log('handleModelChange: ', newModel);
        console.log(session);

        setModel(newModel);
    
        if (session) {
          session.model = newModel;
    
          // Update session in localStorage
          const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
          const updatedSessions = savedSessions.map((s: typeof session) =>
            s.id === session.id ? { ...s, model: newModel } : s
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        }
      };

    const handleAIResponse = async (message: string) => {
        setIsTyping(true); // Indicate that the AI is typing
        let aiResponse = ''; // Variable to accumulate the response

        // Add an empty AI message to the chat (which we'll update as we get the response)
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', content: '' }]);

        // Fetch full response from the fetchAIResponse function
        const fullResponse = await fetchAIResponse(message, aiService, model);

        //Typing effect logic
        for (let i = 0; i < fullResponse.length; i++) {
            aiResponse += fullResponse[i];
        setMessages((prev) => [...prev.slice(0, -1), { role: 'ai', content: aiResponse }]); // Update AI message as it types

        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate typing delay
        }
       
        setIsTyping(false); // Typing is done
        return fullResponse;
    };

    const handleSendMessage = useCallback(async () => {
        if(userInput.trim()) {
            const newMessage = { role: 'user', content: userInput };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setUserInput('');
            const aiResponse = await handleAIResponse(userInput);
            const updatedWithAI = [...updatedMessages, { role: 'ai', content: aiResponse }];
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
            role={msg.role === 'user' || msg.role === 'ai' ? msg.role : 'ai'} // Default to 'ai' if invalid
            content={msg.content} 
            />
          ))}
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
        sx={{borderRadius: '25px', marginLeft: '10px'}}
        variant="contained" color="primary" onClick={handleSendMessage} >
          Send
        </Button>
      </Box>
    </Box>
  );

};

export default ChatUI;
