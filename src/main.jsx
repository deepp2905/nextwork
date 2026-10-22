import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TooltipProvider } from './components/Tooltip.jsx';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/documentation-themes/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TooltipProvider><App /></TooltipProvider>
  </React.StrictMode>
);
