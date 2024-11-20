import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import '../styles/AllFeeds.css'
import Table from './Table'
import { GraphContext } from '../contexts/Graph'
import { ModeContext } from '../contexts/Mode'
import LinearIndeterminate from './LinearIndeterminate'
import { applyFilters } from '../utils/helpers'

function AllFeeds() {
  const graphContext = useContext(GraphContext);
  const mode = useContext(ModeContext);
  const [clippedData, setClippedData] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [loadMoreButton, setLoadMoreButton] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState({
    symbolFilters: [],
    chainFilters: [],
    reporterFilters: [],
    dateFilters: [],
    startDateSearchTerm: "",
    endDateSearchTerm: ""
  });

  // Handle initial data loading
  useEffect(() => {
    if (!graphContext.decodedData) return;
    setClippedData(prevData => {
      const newData = graphContext.decodedData.slice(0, 50);
      return [...newData, ...prevData.filter(item => 
        !newData.some(newItem => newItem.id === item.id))];
    });
  }, [graphContext.decodedData]);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!clippedData) return;

    let filteredData = clippedData.filter(event => {
      const symbolMatch = filterState.symbolFilters.length === 0 || 
                         filterState.symbolFilters.includes(event.decodedValueName);
      const chainMatch = filterState.chainFilters.length === 0 || 
                        filterState.chainFilters.includes(event.chain);
      const reporterMatch = filterState.reporterFilters.length === 0 || 
                           filterState.reporterFilters.includes(event.decodedReporter);
      
      let dateMatch = true;
      if (filterState.startDateSearchTerm && filterState.endDateSearchTerm) {
        let startDate = new Date(filterState.startDateSearchTerm);
        let endDate = new Date(filterState.endDateSearchTerm);
        let eventDate = new Date(event.decodedTime.split(',')[0].trim().split('/').reverse().join('-'));
        dateMatch = eventDate >= startDate && eventDate <= endDate;
      }
  
      return symbolMatch && chainMatch && reporterMatch && dateMatch;
    });

    setViewing(filteredData.slice(0, 6 * currentPage));
    setFiltering(filteredData.length < clippedData.length);
    setLoadMoreButton(filteredData.length > 6 * currentPage);
  }, [clippedData, filterState, currentPage]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleLoadMore = useCallback(() => {
    if (!loadMoreButton) return;
    setCurrentPage(prev => prev + 1);
  }, [loadMoreButton]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilterState(newFilters);
    setCurrentPage(1); // Reset pagination when filters change
  }, []);

  return (
    <>
      {graphContext?.decodedData ? (
        <div className="AllFeedsView">
          <Table
            data={viewing}
            allData={graphContext}
            setFiltering={setFiltering}
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
          {loadMoreButton && (
            <button
              className={mode.mode === 'dark' ? 'AllFeeds__Button' : 'AllFeeds__ButtonDark'}
              onClick={handleLoadMore}
              style={{ cursor: 'pointer' }}
            >
              load more
            </button>
          )}
        </div>
      ) : (
        <div className="Loading">
          <LinearIndeterminate />
        </div>
      )}
    </>
  );
}

export default AllFeeds
