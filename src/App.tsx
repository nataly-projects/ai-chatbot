import React from 'react';
import { AppBar, Toolbar, Typography, Box, Grid } from '@mui/material';
import SessionList from './components/SessionList';
import ChatSession from './components/ChatSession';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {

  return (
    <Router>
      <Box style={{height:"90%", width:"100%", display:"flex", flexDirection:"column", backgroundColor:"#f0f0f0", margin: '25px'}}>
        {/* Top Bar */}
        <AppBar position="static" sx={{ backgroundColor: '#f0f0f0', boxShadow: 'none', padding: '0 20px', borderBottom: '1px solid #ccc' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', width: '20%' }}>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
              Previous Chats
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 500, textAlign: 'center' }}>
              My Candidates AI Chat
            </Typography>
          </Box>

        </Toolbar>
      </AppBar>

        <Grid container style={{ flexGrow: 1, height: '100%' }}>
          <Grid item xs={3} style={{ backgroundColor: '#f5f5f5', height: '100%', borderRight: '1px solid #ccc' }}>
            <SessionList />
          </Grid>
          <Grid item xs={9} style={{ padding: 2, height: '100%' }}>

          {/* Routing between sessions */}
          <Routes>
              {/* Route to handle specific chat sessions */}
              <Route path="/session/:sessionId" element={<ChatSession />} />
              <Route path="/" element={<Typography variant="h6" style={{ padding: '20px', textAlign: 'center' }}></Typography>} />
          </Routes>
          </Grid>
        </Grid>
      </Box>
    </Router>
  );
};

export default App;