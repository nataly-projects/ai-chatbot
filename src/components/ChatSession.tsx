import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatUI from './ChatUI';
import { ChatSessionType } from '../utils/types';

const ChatSession: React.FC<{ }> = () => {
    const { sessionId } = useParams<{ sessionId: string }>(); // Get the sessionId from the URL
    const [session, setSession] = useState<ChatSessionType | null>(null);

    useEffect(() => {
        // Load the session from localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '{]');
        const foundSession = savedSessions[sessionId || '']; 
        setSession(foundSession || null); // Set session if found, else null
    }, [sessionId]);

    const handleUpdateMessages = (updatedMessages: { role: string; content: string }[]) => {
        if (!session) return;
        // Update the session messages
        const updatedSession = { ...session, messages: updatedMessages } as ChatSessionType;
        setSession(updatedSession);

        // Save the updated session in localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');
        savedSessions[session.id] = updatedSession; 
        localStorage.setItem('chatSessions', JSON.stringify(savedSessions));

    };

    return (
        <ChatUI session={session} onMessagesUpdate={handleUpdateMessages} />
    );
};

export default ChatSession;
