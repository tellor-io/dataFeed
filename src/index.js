import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import User from './contexts/User';

ReactDOM.render(
    <User>
      <App />
    </User>
  ,
  document.getElementById('root')
);

