import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { MessageProps } from '../utils/types';


const Message: React.FC<MessageProps> = React.memo(({ role, content }: { role: string; content: string }) => {
    return (
        <Box
          display="flex"
          justifyContent={role === 'user' ? 'flex-start' : 'flex-end'}
          marginBottom={5}
        >
          <Paper
            elevation={2}
            style={{
              padding: '10px 15px',
              backgroundColor: role === 'user' ? '#1976d2' : '#ccc',
              maxWidth: '60%',
              borderRadius: role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
            }}
        
          >
            <Typography style={{whiteSpace: 'pre-wrap'}}>{content}</Typography>
          </Paper>
        </Box>
    );

});

export default Message;
