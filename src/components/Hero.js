import React, { useContext } from 'react'

import '../styles/Hero.css'
//Components
import AllFeeds from '../components/AllFeeds.js'
import AllTips from './AllTips'
//Contexts
import Graph from '../contexts/Graph'
import GraphAutopay from '../contexts/GraphAutopay'
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
        <GraphAutopay>
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
              <AllFeeds />
              <h3 style={{marginTop: '1em'}}>Tips</h3>
              <AllTips />
            </div>
        </GraphAutopay>
      </Graph>
    </div>
  )
}

export default Hero
