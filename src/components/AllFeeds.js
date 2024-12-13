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
  const [viewing, setViewing] = useState([]);
  const [loadMoreButton, setLoadMoreButton] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataMerged, setIsDataMerged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
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
    if (!graphContext.decodedData) {
      setIsLoading(true);
      return;
    }

    const initialData = graphContext.decodedData;
    setClippedData(initialData);
    setViewing(initialData.slice(0, 6));
    setIsDataMerged(true);
    setIsLoading(false);
  }, [graphContext.decodedData]);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!clippedData || !isDataMerged) return;
    
    setIsFilterLoading(true);

    let filteredData = clippedData;
    
    if (filterState.symbolFilters.length > 0 || 
        filterState.chainFilters.length > 0 || 
        filterState.reporterFilters.length > 0 ||
        (filterState.startDateSearchTerm && filterState.endDateSearchTerm)) {
      
      filteredData = clippedData.filter(event => {
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
    }

    const itemsPerPage = 6;
    const startIndex = 0;
    const endIndex = Math.max(itemsPerPage * currentPage, itemsPerPage);
    
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setViewing(paginatedData);
    setFiltering(filteredData.length < clippedData.length);
    setLoadMoreButton(filteredData.length > endIndex);
    setIsFilterLoading(false);
  }, [clippedData, filterState, currentPage, isDataMerged]);

  useEffect(() => {
    if (isDataMerged) {
      applyFilters();
    }
  }, [applyFilters, isDataMerged]);

  const handleLoadMore = useCallback(() => {
    if (!loadMoreButton) return;
    setCurrentPage(prev => prev + 1);
  }, [loadMoreButton]);

  const handleFilterChange = useCallback((newFilters) => {
    setIsFilterLoading(true);
    setFilterState(newFilters);
    setCurrentPage(1);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="Loading">
          <LinearIndeterminate />
        </div>
      ) : (
        <div className="AllFeedsView">
          <Table
            data={viewing}
            allData={graphContext}
            setFiltering={setFiltering}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            isFilterLoading={isFilterLoading}
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
      )}
    </>
  );
}

export default AllFeeds
