import React, { useState, useEffect } from 'react';
import { Button, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChatSessionType } from '../utils/types';

const SessionList = () => {
  const [sessions, setSessions] = useState<ChatSessionType[]>([]);
  const [sessionIdSelect, setSessionIdSelect] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    setSessions(savedSessions);

    // Automatically create a new session if none exist
    if (savedSessions.length === 0) {
        handleNewSession(); 
      }
  }, []);

  const handleNewSession = () => {
    const newSession: ChatSessionType = {
      id: Date.now().toString(), 
      name: `Session ${sessions.length + 1}`,
      messages: [],
      aiService: 'OpenAI',
      model: 'gpt-4o'
    };

    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');

    const updatedSessions = [...savedSessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));

    setSessionIdSelect(newSession.id);
    // Navigate to the new session
    navigate(`/session/${newSession.id}`);
  };

  const handleSessionClick = (sessionId: string) => {
    setSessionIdSelect(sessionId);
    // Navigate to the selected session
    navigate(`/session/${sessionId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor:"#f0f0f0" }}>
        <Button
        variant="text"
        onClick={handleNewSession}
        sx={{
            paddingTop: 2,
          '&:hover': {
            backgroundColor: "#c9c9c9",
          }
        }}
        >
            New Chat
        </Button>
        {/* List of sessions */}
        <List style={{ flexGrow: 1, overflowY: 'auto' }}>
            {sessions.map((session) => (
            <ListItem  sx={{
                marginBottom: '10px',
                padding: 0,
                border: '0px',
                backgroundColor: session.id === sessionIdSelect ? '#ccc' : '#f0f0f0', 
                '&:hover': {
                  backgroundColor: session.id === sessionIdSelect ? '#ccc' : '#c9c9c9',
                }
            }}
            key={session.id}
            onClick={() => handleSessionClick(session.id)}
            >
                <Button fullWidth variant="text" sx={{borderTop: '1px solid #ccc'}}> 
                {session.name}
                </Button>
            </ListItem>
            ))}
        </List>
      
    </div>
  );
};

export default SessionList;
