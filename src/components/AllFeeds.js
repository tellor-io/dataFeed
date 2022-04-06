import React, { useContext, useEffect, useState } from 'react'
import '../styles/AllFeeds.css'
import Table from './Table'
//Context
import { GraphContext } from '../contexts/Graph'
//Components
import LinearIndeterminate from './LinearIndeterminate'

function AllFeeds() {
  //Context State
  const data = useContext(GraphContext)
  //Component State
  const [clippedData, setClippedData] = useState(null)
  const [loadMoreClicks, setLoadMoreClicks] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [loadMoreButton, setLoadMoreButton] = useState(true)

  useEffect(() => {
    if (!data.decodedData) return
    setClippedData(data.decodedData.slice(0, 50))

    return () => {
      setClippedData(null)
    }
  }, [data.decodedData])

  useEffect(() => {
    if (!clippedData) return
    setViewing(clippedData.slice(0, 6))

    return () => {
      setViewing(null)
    }
  }, [clippedData]) //eslint-disable-line

  const handleLoadMore = () => {
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
      {data && data.decodedData ? (
        <div className="AllFeedsView">
          <Table data={viewing} />
          <button
            className="AllFeeds__Button"
            onClick={handleLoadMore}
            style={{ cursor: loadMoreButton ? 'pointer' : 'not-allowed' }}
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

export default AllFeeds
