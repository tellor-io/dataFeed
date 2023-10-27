import React, { useContext, useEffect, useState } from 'react'
import '../styles/AllFeeds.css'
import TipTable from './TipTable'
//Context
import {  GraphAutopayContext } from '../contexts/GraphAutopay'
import { ModeContext } from '../contexts/Mode'
import LinearIndeterminate from './LinearIndeterminate'
//Components

function AllTips() {
  //Context State
  const autoPayData = useContext(GraphAutopayContext)
  const mode = useContext(ModeContext)
  //Component State
  const [clippedData, setClippedData] = useState([])
  const [loadMoreClicks, setLoadMoreClicks] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [loadMoreButton, setLoadMoreButton] = useState(true)
  const [filtering, setFiltering] = useState(false)

  useEffect(() => {
    if (!autoPayData.decodedData) return
    const newData = autoPayData.decodedData.slice(0, 50);
    setClippedData(prevData => {
      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
        return [...prevData, ...newData]
      }
      return prevData;
    })
  }, [autoPayData.decodedData])

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
      {autoPayData && autoPayData.decodedData ? (
        <div className="AllFeedsView">
         
          <TipTable
            data={viewing}
            allData={autoPayData}
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
        <LinearIndeterminate />
      )}
    </>
  )
}

export default AllTips
