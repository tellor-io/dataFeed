import React, { useContext } from 'react'
//Components
import Nav from './components/frontendBoilerplate/Nav'
import Footer from './components/frontendBoilerplate/Footer'
import Hero from './components/Hero'
//Styles
import './App.css'
//Context
import { ModeContext } from './contexts/Mode'

function App() {
  const mode = useContext(ModeContext)

  return (
    <div className={mode && mode.mode === 'dark' ? 'App' : 'AppLight'}>
      <Nav />
      <div
        className={
          mode && mode.mode === 'dark' ? 'HeroContainer' : 'HeroContainerLight'
        }
      >
        <Hero />
      </div>
      <Footer />
    </div>
  )
}

export default App
