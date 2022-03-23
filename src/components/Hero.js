import React, { useState, useEffect, useContext } from 'react'
//ReactRouterDom
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
//Styles
import '../styles/Hero.css'
//Components
import AllFeeds from '../components/AllFeeds.js'
import MyFeeds from '../components/MyFeeds.js'
//Contexts
import Graph from '../contexts/Graph'
//The Graph
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

//The Graph
const clientPolygon = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joshuasamaniego/autopay-matic',
  cache: new InMemoryCache(),
})
const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joshuasamaniego/autopay-mumbai',
  cache: new InMemoryCache(),
})

function Hero() {
  //Component State
  const [active, setActive] = useState(true)
  const [inactive, setInactive] = useState(true)
  // //Context State
  // const user = useContext()

  // //useEffect to set ApolloClient
  // useEffect(() => {
  //   if (!user || !user.currentUser) return
  //   switch (user.currentUser.network) {
  //     case 'matic':
  //       setApolloClient(clientPolygon)
  //       return
  //     case 'mumbai':
  //       setApolloClient(clientMumbai)
  //       return
  //     default:
  //       setApolloClient(clientMumbai)
  //       return
  //   }
  // }, [user])

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
      <h1 className="HeroHeader">your oracle at work</h1>
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
      <ApolloProvider client={{}}>
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
        </Graph>
      </ApolloProvider>
    </div>
  )
}

export default Hero
