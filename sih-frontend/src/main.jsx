import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // We removed <React.StrictMode> to prevent double-initialization of the QR Scanner
  <App />
)