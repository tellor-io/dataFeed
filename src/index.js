import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import User from './contexts/User'
import Mode from './contexts/Mode'
import ErrorBoundary from './components/ErrorBoundary'

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <User>
      <Mode>
        <App />
      </Mode>
    </User>
  </ErrorBoundary>
);