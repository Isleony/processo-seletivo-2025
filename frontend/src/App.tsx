import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DuvListPage from './pages/DuvListPage';
import DuvDetailPage from './pages/DuvDetailPage';



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DuvListPage />} />
          <Route path="/duvs/:id" element={<DuvDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;