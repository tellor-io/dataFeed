import React, { useState, useEffect } from 'react'
//ReactRouterDom
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
//Styles
import '../styles/Hero.css'
//Components
import AllFeeds from '../components/AllFeeds.js'
import MyFeeds from '../components/MyFeeds.js'

function Hero() {
  //Component State
  const [active, setActive] = useState(true)
  const [inactive, setInactive] = useState(true)
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
      <h1 className="HeroHeader">Your Oracle At Work</h1>
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
        Polygon Mainnet
      </p>
      <Router>
        <div className="HeroNavLinks">
          <Link
            to="/"
            className={active ? 'ActiveLink' : 'InactiveLink'}
            onClick={() => activeHelper('AllFeeds')}
          >
            All Feeds
          </Link>
          <Link
            to="/myfeeds"
            className={inactive ? 'InactiveLink' : 'ActiveLink'}
            onClick={() => activeHelper('MyFeeds')}
          >
            My Feed(s)
          </Link>
        </div>
        <div className="HeroSection">
          <Routes>
            <Route exact path="/" element={<AllFeeds />} />
            <Route exact path="/myfeeds" element={<MyFeeds />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default Hero
