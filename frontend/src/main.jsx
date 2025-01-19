import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/useAuth.jsx';
import Layout from './components/Layout.jsx';

// Ensure you're calling createRoot from react-dom/client
const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <ChakraProvider>
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <App />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);
