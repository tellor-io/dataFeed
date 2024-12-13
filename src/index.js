import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import User from './contexts/User'
import Mode from './contexts/Mode'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.render(
  <ErrorBoundary>
    <User>
      <Mode>
        <App />
      </Mode>
    </User>
  </ErrorBoundary>,
  document.getElementById('root')
);