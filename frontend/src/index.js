import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { EventsContextProvider } from './context/EventContext';
import { AuthContextProvider } from './context/AuthContext';
import { SocketContextProvider } from './context/SocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <EventsContextProvider>
    
          <App />
        </EventsContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>

  </React.StrictMode>
);