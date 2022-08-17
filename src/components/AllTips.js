import React, { useContext, useEffect, useState } from 'react'
import '../styles/AllFeeds.css'
import { GraphContext } from '../contexts/Graph'
import Table from './Table'
import TipTable from './TipTable'
//Context
import { GraphAutopay } from '../archived/contexts/GraphAutopay'
import { ModeContext } from '../contexts/Mode'
//Components
import LinearIndeterminate from './LinearIndeterminate'

function AllTips() {
  //Context State
  const autoPayData = useContext(GraphAutopay)
  const graphData = useContext(GraphContext)
  const mode = useContext(ModeContext)
  //Component State
  const [clippedData, setClippedData] = useState(null)
  const [loadMoreClicks, setLoadMoreClicks] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [loadMoreButton, setLoadMoreButton] = useState(true)
  const [filtering, setFiltering] = useState(false)

  console.log(autoPayData, 'did we hit the jackpot')

  useEffect(() => {
    if (!graphData.decodedData) return
    setClippedData(graphData.decodedData.slice(0, 50))

    return () => {
      setClippedData(null)
    }
  }, [graphData.decodedData])

  useEffect(() => {
    if (!clippedData) return
    setViewing(clippedData.slice(0, 6))

    return () => {
      setViewing(null)
    }
  }, [clippedData]) //eslint-disable-line

  const handleLoadMore = () => {
    if (!loadMoreButton) return
    setLoadMoreClicks(loadMoreClicks + 1)
    let loads = Math.ceil((clippedData.length - 6) / 6)
    let loadAmount = 6 + 6 * loadMoreClicks
    if (loadMoreClicks <= loads) {
      setViewing(clippedData.slice(0, loadAmount))
      if (loadMoreClicks === loads) {
        setLoadMoreButton(false)
      }
    }
  }

  return (
    <>
      {graphData && graphData.decodedData ? (
        <div className="AllFeedsView">
          <TipTable
            data={viewing}
            allData={graphData}
            setFiltering={setFiltering}
          />
          <button
            className={
              mode.mode === 'dark' ? 'AllFeeds__Button' : 'AllFeeds__ButtonDark'
            }
            onClick={handleLoadMore}
            style={{
              cursor: loadMoreButton ? 'pointer' : 'not-allowed',
              display: filtering ? 'none' : 'flex',
            }}
          >
            {loadMoreButton ? 'load more' : 'viewing last 50 reports'}
          </button>
        </div>
      ) : (
        <div className="Loading">
          <LinearIndeterminate />
        </div>
      )}
    </>
  )
}

export default AllTips
