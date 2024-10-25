import React, { useState, createContext } from 'react'

export const ModeContext = createContext()

const Mode = ({ children }) => {
  //Context State
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('mode')
    return saved || 'dark'
  })

  const changeMode = () => {
    if (mode === 'light') {
      localStorage.setItem('mode', 'dark')
      setMode('dark')
    } else if (mode === 'dark') {
      localStorage.setItem('mode', 'light')
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
