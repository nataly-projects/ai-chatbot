import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatUI from './ChatUI';
import { ChatSessionType } from '../utils/types';

const ChatSession: React.FC<{ }> = () => {
    const { sessionId } = useParams<{ sessionId: string }>(); // Get the sessionId from the URL
    const [session, setSession] = useState<ChatSessionType | null>(null);

    useEffect(() => {
        // Load the session from localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        const foundSession = savedSessions.find((s: ChatSessionType) => s.id === sessionId);
        setSession(foundSession);
    }, [sessionId]);

    const handleUpdateMessages = (updatedMessages: { role: string; content: string }[]) => {
        // Update the session messages
        const updatedSession = { ...session, messages: updatedMessages } as ChatSessionType;
        setSession(updatedSession);

        // Save the updated session in localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        const updatedSessions = savedSessions.map((s: ChatSessionType) =>
            s.id === sessionId ? updatedSession : s
        );
        localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    };

    return (
        <ChatUI session={session} onMessagesUpdate={handleUpdateMessages} />
    );
};

export default ChatSession;
