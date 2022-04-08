import React, { useState, createContext } from 'react'

export const ModeContext = createContext()

const Mode = ({ children }) => {
  //Context State
  const [mode, setMode] = useState('dark')

  const changeMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else if (mode === 'dark') {
      setMode('light')
    }
  }

  const ModeContextObject = {
    mode: mode,
    changeMode: changeMode,
  }

  return (
    <ModeContext.Provider value={ModeContextObject}>
      {children}
    </ModeContext.Provider>
  )
}

export default Mode
