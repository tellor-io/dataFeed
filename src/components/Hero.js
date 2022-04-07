import React, { useState, useEffect } from 'react'
//ReactRouterDom
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
//Styles
import '../styles/Hero.css'
//Components
import AllFeeds from '../components/AllFeeds.js'
//Contexts
import Graph from '../contexts/Graph'

function Hero() {
  //Component State
  const [active, setActive] = useState(true)
  const [inactive, setInactive] = useState(true) //eslint-disable-line

  //useEffect for routing
  useEffect(() => {
    if (window.location.href.includes('/myfeeds')) {
      setActive(false)
      setInactive(false)
    }
  }, [])

  const activeHelper = (tab) => {
    if (tab === 'AllFeeds') {
      setActive(true)
      setInactive(true)
    } else if (tab === 'MyFeeds') {
      setActive(false)
      setInactive(false)
    }
  }

  return (
    <div className="HeroInnerContainer">
      <h1 className="HeroHeader">Your Oracle at Work</h1>
      <p className="HeroMainText">
        <strong>Tellor status:</strong>
        <br />
        100% of funded data feeds are currently reporting
      </p>
      <p className="HeroMainText">
        <strong>Chains:</strong>
        <br />
        Ethereum Mainnet
        <br />
        Rinkeby Testnet
        <br />
        Polygon Mainnet
        <br />
        Mumbai Testnet
      </p>
      <Graph>
        <Router>
          <div className="HeroNavLinks">
            <Link
              to="/"
              className={active ? 'ActiveLink' : 'InactiveLink'}
              onClick={() => activeHelper('AllFeeds')}
            >
              All Feeds
            </Link>
          </div>
          <div className="HeroSection">
            <Routes>
              <Route exact path="/" element={<AllFeeds />} />
            </Routes>
          </div>
        </Router>
      </Graph>
    </div>
  )
}

export default Hero
