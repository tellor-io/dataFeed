import React, { useContext, useEffect, useState } from 'react'
import '../styles/AllFeeds.css'
import TipTable from './TipTable'
//Context
import {  GraphAutopayContext } from '../contexts/GraphAutopay'
import { ModeContext } from '../contexts/Mode'
import LinearIndeterminate from './LinearIndeterminate'
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

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
    if (!autoPayData.decodedData) return;
    const newData = autoPayData.decodedData.slice(0, 50);
    
    // Update viewing first
    setViewing(newData.slice(0, 6 * loadMoreClicks));
    
    // Then update clippedData
    setClippedData(prevData => {
      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
        return newData;
      }
      return prevData;
    });
  }, [autoPayData.decodedData, loadMoreClicks]);

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
                   <ErrorBoundary> {/* Wrap TipTable with ErrorBoundary */}

          <TipTable
            data={viewing}
            allData={autoPayData}
            setFiltering={setFiltering}
          />
                    </ErrorBoundary>

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
