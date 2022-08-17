import React, { useContext } from 'react'
//ReactRouterDom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//Styles
import '../styles/Hero.css'
//Components
import AllFeeds from '../components/AllFeeds.js'
import AllTips from './AllTips'
//Contexts
import Graph from '../contexts/Graph'
import { ModeContext } from '../contexts/Mode'

function Hero() {
  //Component State
  // const [active, setActive] = useState(true)
  // const [inactive, setInactive] = useState(true) //eslint-disable-line
  //
  const mode = useContext(ModeContext)

  //useEffect for routing
  // useEffect(() => {
  //   if (window.location.href.includes('/myfeeds')) {
  //     setActive(false)
  //     setInactive(false)
  //   }
  // }, [])

  // const activeHelper = (tab) => {
  //   if (tab === 'AllFeeds') {
  //     setActive(true)
  //     setInactive(true)
  //   } else if (tab === 'MyFeeds') {
  //     setActive(false)
  //     setInactive(false)
  //   }
  // }

  return (
    <div className="HeroInnerContainer">
      <h1 className="HeroHeader">Your Oracle at Work</h1>
      <Graph>
        <Router>
          <div
            className={
              mode && mode.mode === 'dark'
                ? 'HeroNavLinks'
                : 'HeroNavLinksLight'
            }
          >
            {/* <Link
              to="/"
              className={active ? 'ActiveLink' : 'InactiveLink'}
              onClick={() => activeHelper('AllFeeds')}
            >
              All Feeds
            </Link> */}
          </div>
          <div className="HeroSection">
            <Routes>
              <Route exact path="/" element={<AllFeeds />} />
            </Routes>
            <AllTips />
          </div>
        </Router>
      </Graph>
    </div>
  )
}

export default Hero
