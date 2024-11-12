import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import User from './contexts/User'
import Mode from './contexts/Mode'

ReactDOM.render(
  <User>
    <Mode>
      <App />
    </Mode>
  </User>,
  document.getElementById('root')
)
