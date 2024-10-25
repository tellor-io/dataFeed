import React, { useEffect, useRef, useState, useContext, useCallback } from 'react'
import '../styles/Table.css'
import { ReactComponent as FilterIcon } from '../assets/filter_outline.svg'
import { ReactComponent as FilterIconFilled } from '../assets/filter.svg'
import { ReactComponent as Checked } from '../assets/done.svg'
//Icons
import { Jazzicon } from '@ukstv/jazzicon-react'
//Utils
import { truncateAddr } from '../utils/helpers'
//Contexts
import { ModeContext } from '../contexts/Mode'

function Table({ data, allData, setFiltering }) {
  //Component State
  const [tableData, setTableData] = useState([])
  //
  const [symbolClicked, setSymbolClicked] = useState(false)
  const [chainClicked, setChainClicked] = useState(false)
  const [reporterClicked, setReporterClicked] = useState(false)
  const [dateClicked, setDateClicked] = useState(false)
  //
  const [reportedSymbols, setReportedSymbols] = useState(null)
  const [reportedChains, setReportedChains] = useState(null)
  const [reportedReporters, setReportedReporters] = useState(null)
  const [reportedDates, setReportedDates] = useState(null)
  const [symbolSearchTerm, setSymbolSearchTerm] = useState("");
  const [reporterSearchTerm, setReporterSearchTerm] = useState("");
  const [startDateSearchTerm, setStartDateSearchTerm] = useState("");
  const [endDateSearchTerm, setEndDateSearchTerm] = useState("");
  //
  const [allFilters, setAllFilters] = useState([])
  const [symbolFilters, setSymbolFilters] = useState([])
  const [chainFilters, setChainFilters] = useState([])
  const [reporterFilters, setReporterFilters] = useState([])
  const [dateFilters, setDateFilters] = useState([])
  //Refs
  const symbolRef = useRef()
  const chainRef = useRef()
  const reporterRef = useRef()
  const dateRef = useRef()
  const dropdownRef = useRef(null);
  //Contexts
  const mode = useContext(ModeContext)

  // Memoize the filter application function
  const applyFilters = useCallback(() => {
    if (!allData || !allData.decodedData) return;

    let filteredData = allData.decodedData.filter(event => {
      const symbolMatch = symbolFilters.length === 0 || symbolFilters.includes(event.decodedValueName);
      const chainMatch = chainFilters.length === 0 || chainFilters.includes(event.chain);
      const reporterMatch = reporterFilters.length === 0 || reporterFilters.includes(event.decodedReporter);
      
      let startDate = new Date(startDateSearchTerm);
      let endDate = new Date(endDateSearchTerm);
      let eventDate = new Date(event.decodedTime.split(',')[0].trim().split('/').reverse().join('-'));

      const dateMatch = startDateSearchTerm && endDateSearchTerm ? (eventDate >= startDate && eventDate <= endDate) : dateFilters.length === 0 || dateFilters.some(filterDate => event.decodedTime.startsWith(filterDate));
  
      return symbolMatch && chainMatch && reporterMatch && dateMatch;
    });

    const areFiltersApplied = symbolFilters.length > 0 || chainFilters.length > 0 || reporterFilters.length > 0 || dateFilters.length > 0 || (startDateSearchTerm && endDateSearchTerm);
  
    setTableData(areFiltersApplied ? filteredData : filteredData.slice(0, 6));
    setFiltering(filteredData.length > 0);
  }, [allData, symbolFilters, chainFilters, reporterFilters, dateFilters, startDateSearchTerm, endDateSearchTerm, setFiltering]);

  // Effect for initial data load and updates
  useEffect(() => {
    if (!data) return;
    setTableData(data);
  }, [data]);

  // Effect for populating filter options
  useEffect(() => {
    if (!allData || !allData.decodedData) return;
    
    const symbols = new Set();
    const chains = new Set();
    const reporters = new Set();
    const dates = new Set();

    allData.decodedData.forEach((event) => {
      if (event.decodedValueName) {
        if (event.feedType === 'Snapshot') {
          symbols.add('Snapshot');
        } else if (!event.feedType) {
          symbols.add(event.decodedValueName);
        }
      }
      if (event.chain) chains.add(event.chain);
      if (event.decodedReporter) reporters.add(event.decodedReporter);
      if (event.decodedTime) dates.add(event.decodedTime.split(',')[0].trim());
    });

    setReportedSymbols(Array.from(symbols));
    setReportedChains(Array.from(chains));
    setReportedReporters(Array.from(reporters));
    setReportedDates(Array.from(dates));
  }, [allData]);

  // Effect to apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Modify handleFilterApply to use the memoized applyFilters function
  const handleFilterApply = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  //Handlers
  const handleClick = (iconType) => {
    switch (iconType) {
      case 'symbol':
        setSymbolClicked(true)
        symbolRef.current.classList.add('display')
        break
      case 'chain':
        setChainClicked(true)
        chainRef.current.classList.add('display')
        break
      case 'reporter':
        setReporterClicked(true)
        reporterRef.current.classList.add('display')
        break
      case 'date':
        setDateClicked(true)
        dateRef.current.classList.add('display')
        break
      default:
        return
    }
  }
  const handleClose = (iconType) => {
    switch (iconType) {
      case 'symbol':
        setSymbolClicked(false)
        symbolRef.current.classList.remove('display')
        break
      case 'chain':
        setChainClicked(false)
        chainRef.current.classList.remove('display')
        break
      case 'reporter':
        setReporterClicked(false)
        reporterRef.current.classList.remove('display')
        break
      case 'date':
        setDateClicked(false)
        dateRef.current.classList.remove('display')
        break
      default:
        return
    }
  }
  const handleFilter = (filterType, filterValue) => {
    let temp
    let allFiltersTemp
    let allFiltersObj = { filterType: filterType, filterValue: filterValue }

    switch (filterType) {
      case 'symbol':
        if (symbolFilters.includes(filterValue)) {
          temp = symbolFilters.filter((filters) => filters !== filterValue)
          allFiltersTemp = allFilters.filter(
            (filters) => filters.filterValue !== filterValue
          )
          setSymbolFilters(temp)
          setAllFilters(allFiltersTemp)
        } else {
          setSymbolFilters([...symbolFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      case 'chain':
        if (chainFilters.includes(filterValue)) {
          temp = chainFilters.filter((filters) => filters !== filterValue)
          allFiltersTemp = allFilters.filter(
            (filters) => filters.filterValue !== filterValue
          )
          setChainFilters(temp)
          setAllFilters(allFiltersTemp)
        } else {
          setChainFilters([...chainFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      case 'reporter':
        if (reporterFilters.includes(filterValue)) {
          temp = reporterFilters.filter((filters) => filters !== filterValue)
          allFiltersTemp = allFilters.filter(
            (filters) => filters.filterValue !== filterValue
          )
          setReporterFilters(temp)
          setAllFilters(allFiltersTemp)
        } else {
          setReporterFilters([...reporterFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      case 'date':
        if (dateFilters.includes(filterValue)) {
          temp = dateFilters.filter((filters) => filters !== filterValue)
          allFiltersTemp = allFilters.filter(
            (filters) => filters.filterValue !== filterValue
          )
          setDateFilters(temp)
          setAllFilters(allFiltersTemp)
        } else {
          setDateFilters([...dateFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      default:
        return
    }
  }
  const handleFilterClear = (filterType) => {
    let cleared
    switch (filterType) {
      case 'symbol':
        cleared = allFilters.filter(
          (filters) => filters.filterType !== filterType
        )
        setAllFilters(cleared)
        //handleFilterApply()
        setSymbolFilters([])
        break
      case 'chain':
        cleared = allFilters.filter(
          (filters) => filters.filterType !== filterType
        )
        setAllFilters(cleared)
        handleFilterApply()
        setChainFilters([])
        break
      case 'reporter':
        cleared = allFilters.filter(
          (filters) => filters.filterType !== filterType
        )
        setAllFilters(cleared)
        handleFilterApply()
        setReporterFilters([])
        break
        case 'date':
          cleared = allFilters.filter(
            (filters) => filters.filterType !== filterType
          )
          setAllFilters(cleared)
          setStartDateSearchTerm("") // Clear the start date search term
          setEndDateSearchTerm("") // Clear the end date search term
          handleFilterApply()
          setDateFilters([])
          break
        default:
          return
    }
  }
  const handleRowClick = (txnLink) => {
    window.open(txnLink, '_blank').focus()
  }

  const formatSymbol = (symbol) => {
    if (symbol === 'SUPEROETHB/ETH') {
      return 'SUPER OETHb/ETH';
    }
    return symbol;
  };

  const formatValue = (value) => {
    if (typeof value === 'string' && value.startsWith('ETH')) {
      const numericPart = value.substring(3).trim(); // Remove 'ETH' and any leading space
      return `${numericPart} ETH`;
    }
    return value;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSymbolClicked(false);
        setChainClicked(false);
        setReporterClicked(false);
        setDateClicked(false);
        symbolRef.current?.classList.remove('display');
        chainRef.current?.classList.remove('display');
        reporterRef.current?.classList.remove('display');
        dateRef.current?.classList.remove('display');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <table className="Table">
      <thead className="TableHeaders">
        <tr className="TH__Header">
          <th className="TH__HeaderSpecial">
            <div className="TH__HeaderDiv">
              <h1>SYMBOLS</h1>
              {symbolClicked ? (
                <FilterIconFilled
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setSymbolClicked(!symbolClicked)}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setSymbolClicked(!symbolClicked)}
                />
              )}
            </div>
            <div
              className={`TableFilterDropdown ${mode.mode === 'dark' ? '' : 'TableFilterDropdownDark'}`}
              ref={(el) => {
                symbolRef.current = el;
                if (symbolClicked) dropdownRef.current = el;
              }}
              style={{ 
                display: symbolClicked ? 'flex' : 'none',
                flexDirection: 'column',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <h3>filter by symbol</h3>
              <input
                type="text"
                placeholder="Search..."
                value={symbolSearchTerm}
                onChange={(e) => setSymbolSearchTerm(e.target.value)}
              />
              <div className="DropdownResults" style={{ flexGrow: 1, overflowY: 'auto' }}>
                {reportedSymbols &&
                  reportedSymbols.filter((symbol) => symbol.toLowerCase().includes(symbolSearchTerm.toLowerCase()))
                  .map((symbol) => (
                    <div
                      key={symbol}
                      className={
                        mode.mode === 'dark'
                          ? 'DropdownDataRow'
                          : 'DropdownDataRowDark'
                      }
                      onClick={() => handleFilter('symbol', symbol)}
                    >
                      {symbolFilters.includes(symbol) ? (
                        <>
                          <p>{symbol}</p>
                          <Checked
                            className={
                              mode.mode === 'dark' ? '' : 'DropdownCheckDark'
                            }
                          />
                        </>
                      ) : (
                        <p>{symbol}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div
                className={
                  mode.mode === 'dark'
                    ? 'DropdownButtons'
                    : 'DropdownButtonsDark'
                }
              >
                <button
                  className={
                    mode.mode === 'dark' ? 'DropdownClear' : 'DropdownClearDark'
                  }
                  onClick={() => handleFilterClear('symbol')}
                >
                  Clear
                </button>
              </div>
            </div>
          </th>
          <th>
            <h1>VALUE</h1>
          </th>
          <th className="TH__HeaderSpecial">
            <div className="TH__HeaderDiv">
              <h1>CHAIN</h1>
              {chainClicked ? (
                <FilterIconFilled
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setChainClicked(!chainClicked)}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setChainClicked(!chainClicked)}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={(el) => {
                chainRef.current = el;
                if (chainClicked) dropdownRef.current = el;
              }}
              style={{ 
                display: chainClicked ? 'flex' : 'none',
                flexDirection: 'column',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <h3>filter by chain</h3>
              <div className="DropdownResults">
                {reportedChains &&
                  reportedChains.map((chain) => (
                    <div
                      key={chain}
                      className={
                        mode.mode === 'dark'
                          ? 'DropdownDataRow'
                          : 'DropdownDataRowDark'
                      }
                      onClick={() => handleFilter('chain', chain)}
                    >
                      {chainFilters.includes(chain) ? (
                        <>
                          <p>{chain}</p>
                          <Checked
                            className={
                              mode.mode === 'dark' ? '' : 'DropdownCheckDark'
                            }
                          />
                        </>
                      ) : (
                        <p>{chain}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div
                className={
                  mode.mode === 'dark'
                    ? 'DropdownButtons'
                    : 'DropdownButtonsDark'
                }
              >
                <button
                  className={
                    mode.mode === 'dark' ? 'DropdownClear' : 'DropdownClearDark'
                  }
                  onClick={() => handleFilterClear('chain')}
                >
                  Clear
                </button>
              </div>
            </div>
          </th>
          <th className="TH__HeaderSpecial">
            <div className="TH__HeaderDiv">
              <h1>REPORTER</h1>
              {reporterClicked ? (
                <FilterIconFilled
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setReporterClicked(!reporterClicked)}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setReporterClicked(!reporterClicked)}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={(el) => {
                reporterRef.current = el;
                if (reporterClicked) dropdownRef.current = el;
              }}
              style={{ 
                display: reporterClicked ? 'flex' : 'none',
                flexDirection: 'column',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <h3>filter by reporter</h3>
              <input
  type="text"
  placeholder="Search..."
  value={reporterSearchTerm}
  onChange={(e) => setReporterSearchTerm(e.target.value)}
/>
              <div className="DropdownResults">
                {reportedReporters &&
  reportedReporters
  .filter((reporter) => reporter.toLowerCase().includes(reporterSearchTerm.toLowerCase()))
    .map((reporter) => (
                    <div
                      key={reporter}
                      className={
                        mode.mode === 'dark'
                          ? 'DropdownDataRow'
                          : 'DropdownDataRowDark'
                      }
                      onClick={() => handleFilter('reporter', reporter)}
                    >
                      {reporterFilters.includes(reporter) ? (
                        <>
                          <p>{truncateAddr(reporter)}</p>
                          <Checked
                            className={
                              mode.mode === 'dark' ? '' : 'DropdownCheckDark'
                            }
                          />
                        </>
                      ) : (
                        <p>{truncateAddr(reporter)}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div
                className={
                  mode.mode === 'dark'
                    ? 'DropdownButtons'
                    : 'DropdownButtonsDark'
                }
              >

                <button
                  className={
                    mode.mode === 'dark' ? 'DropdownClear' : 'DropdownClearDark'
                  }
                  onClick={() => handleFilterClear('reporter')}
                >
                  Clear
                </button>
              </div>
            </div>
          </th>
          <th className="TH__HeaderSpecial">
            <div className="TH__HeaderDiv">
              <h1>DATE(DD/MM/YY), TIME</h1>
              {dateClicked ? (
                <FilterIconFilled
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setDateClicked(!dateClicked)}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => setDateClicked(!dateClicked)}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={(el) => {
                dateRef.current = el;
                if (dateClicked) dropdownRef.current = el;
              }}
              style={{ 
                display: dateClicked ? 'flex' : 'none',
                flexDirection: 'column',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <h3>filter by date</h3>
              <p>Start</p>
              <input
                 type="date"
                 placeholder="Start Date..."
                 value={startDateSearchTerm}
                 onChange={(e) => setStartDateSearchTerm(e.target.value)}
                 className="input-date" // Add this line

               />
                 <p>End</p>
              <input
                 type="date"
                 placeholder="End Date..."
                 value={endDateSearchTerm}
                 onChange={(e) => setEndDateSearchTerm(e.target.value)}
                 className="input-date" // Add this line

               />
              <div className="DropdownResults">
                {reportedDates &&
                  reportedDates.filter((date) => date.toLowerCase().includes(startDateSearchTerm.toLowerCase()) || date.toLowerCase().includes(endDateSearchTerm.toLowerCase()))
                  .map((date) => (
                    <div
                      key={date}
                      className={
                        mode.mode === 'dark'
                          ? 'DropdownDataRow'
                          : 'DropdownDataRowDark'
                      }
                      onClick={() => handleFilter('date', date)}
                    >
                      {dateFilters.includes(date) ? (
                        <>
                          <p>{date}</p>
                          <Checked
                            className={
                              mode.mode === 'dark' ? '' : 'DropdownCheckDark'
                            }
                          />
                        </>
                      ) : (
                        <p>{date}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div
                className={
                  mode.mode === 'dark'
                    ? 'DropdownButtons'
                    : 'DropdownButtonsDark'
                }
              >

                <button
                  className={
                    mode.mode === 'dark' ? 'DropdownClear' : 'DropdownClearDark'
                  }
                  onClick={() => handleFilterClear('date')}
                >
                  Clear
                </button>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData && tableData.length > 0 ? (
          tableData.map((event) => (
            <tr
              key={event.id}
              className={mode.mode === 'dark' ? 'TableBody' : 'TableBodyDark'}
              onClick={() => handleRowClick(event.txnLink)}
            >
              <td className="TB__Symbols">{formatSymbol(event.decodedValueName)}</td>
              <td className="TB__Value">{formatValue(event.decodedValue)}</td>
              <td className="TB__Chain">{event.chain}</td>
              <td className="TB__Reporter">
                <Jazzicon
                  address={event.decodedReporter}
                  className="Table__Jazzicon"
                />
                <p>{truncateAddr(event.decodedReporter)}</p>
              </td>
              <td className="TB__DateTime">{event.decodedTime}</td>
            </tr>
          ))
        ) : (
          <tr className="TableBodyNoMatches">
            <td>Data Doesn't Match Entries</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default Table
