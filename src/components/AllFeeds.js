import React, { useContext, useEffect, useState, useCallback } from 'react'
import '../styles/AllFeeds.css'
import Table from './Table'
import { GraphContext } from '../contexts/Graph'
import { ModeContext } from '../contexts/Mode'
import LinearIndeterminate from './LinearIndeterminate'

function AllFeeds() {
  const graphData = useContext(GraphContext)
  const mode = useContext(ModeContext)
  const [clippedData, setClippedData] = useState([])
  const [loadMoreClicks, setLoadMoreClicks] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [loadMoreButton, setLoadMoreButton] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [filters, setFilters] = useState({
    symbolFilters: [],
    chainFilters: [],
    reporterFilters: [],
    dateFilters: [],
    startDateSearchTerm: "",
    endDateSearchTerm: ""
  })

  useEffect(() => {
    if (!graphData.decodedData) return;
    setClippedData(prevData => {
      const newData = graphData.decodedData.slice(0, 50);
      return [...newData, ...prevData.filter(item => !newData.some(newItem => newItem.id === item.id))];
    });
  }, [graphData.decodedData]);

  const applyFilters = useCallback(() => {
    if (!clippedData) return;

    let filteredData = clippedData.filter(event => {
      const symbolMatch = filters.symbolFilters.length === 0 || filters.symbolFilters.includes(event.decodedValueName);
      const chainMatch = filters.chainFilters.length === 0 || filters.chainFilters.includes(event.chain);
      const reporterMatch = filters.reporterFilters.length === 0 || filters.reporterFilters.includes(event.decodedReporter);
      
      let startDate = new Date(filters.startDateSearchTerm);
      let endDate = new Date(filters.endDateSearchTerm);
      let eventDate = new Date(event.decodedTime.split(',')[0].trim().split('/').reverse().join('-'));

      const dateMatch = filters.startDateSearchTerm && filters.endDateSearchTerm ? (eventDate >= startDate && eventDate <= endDate) : filters.dateFilters.length === 0 || filters.dateFilters.some(filterDate => event.decodedTime.startsWith(filterDate));
  
      return symbolMatch && chainMatch && reporterMatch && dateMatch;
    });

    setViewing(filteredData.slice(0, 6 * loadMoreClicks));
    setFiltering(filteredData.length < clippedData.length);
    setLoadMoreButton(filteredData.length > 6 * loadMoreClicks);
  }, [clippedData, filters, loadMoreClicks]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, clippedData]);

  const handleLoadMore = () => {
    if (!loadMoreButton) return;
    setLoadMoreClicks(prev => prev + 1);
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  }

  return (
    <>
      {graphData && graphData.decodedData ? (
        <div className="AllFeedsView">
          <Table
            data={viewing}
            allData={graphData}
            setFiltering={setFiltering}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
          <button
            className={mode.mode === 'dark' ? 'AllFeeds__Button' : 'AllFeeds__ButtonDark'}
            onClick={handleLoadMore}
            style={{
              cursor: loadMoreButton ? 'pointer' : 'not-allowed',
              display: 'flex',
            }}
          >
            load more
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
