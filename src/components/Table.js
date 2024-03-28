import React, { useEffect, useRef, useState, useContext } from 'react'
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
  const [dateSearchTerm, setDateSearchTerm] = useState("");
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
  //Contexts
  const mode = useContext(ModeContext)

  //useEffect for tableData
  useEffect(() => {
    if (!data) return;
    setTableData(prevData => {
      const newData = data.slice(prevData.length);
      if (JSON.stringify(newData) !== JSON.stringify([])) {
        return [...prevData, ...newData]
        
      }
      return prevData;
    })
  }, [data])

  //useEffect for populating
  //table dropdown data
  useEffect(() => {
    if (!allData && !allData.decodedData) return
    let symbols = []
    let chains = []
    let reporters = []
    let dates = []
    allData.decodedData.forEach((event) => {
      if (!symbols.includes(event.decodedValueName) && event.decodedValueName) {
        if (event.feedType === 'Snapshot' && !symbols.includes('Snapshot')) {
          symbols.push('Snapshot')
        } else if (!event.feedType) {
          symbols.push(event.decodedValueName)
        }
      }
      if (!chains.includes(event.chain)) {
        chains.push(event.chain)
      }
      if (!reporters.includes(event.decodedReporter) && event.decodedReporter) {
        reporters.push(event.decodedReporter)
      }
      if (!dates.includes(event.decodedTime.split(',')[0].trim()) && event.decodedTime) {
        dates.push(event.decodedTime.split(',')[0].trim())
      }
    })
    setReportedSymbols(symbols)
    setReportedChains(chains)
    setReportedReporters(reporters)
    setReportedDates(dates)

    return () => {
      setReportedSymbols(null)
      setReportedChains(null)
      setReportedReporters(null)
      setReportedDates(null)
    }
  }, [allData])

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
  const handleFilterApply = () => {
    let filteredData = allData.decodedData.filter(event => {
      const symbolMatch = symbolFilters.length === 0 || symbolFilters.includes(event.decodedValueName);
      const chainMatch = chainFilters.length === 0 || chainFilters.includes(event.chain);
      const reporterMatch = reporterFilters.length === 0 || reporterFilters.includes(event.decodedReporter);
      
      // Convert dateSearchTerm from YYYY-MM-DD to DD/MM/YYYY for comparison
      let formattedDateSearchTerm = "";
      if (dateSearchTerm) {
        const [year, month, day] = dateSearchTerm.split('-');
        formattedDateSearchTerm = `${day}/${month}/${year}`;
      }

      // Direct comparison with event.decodedTime (assuming it's in DD/MM/YYYY format)
      const dateMatch = dateSearchTerm ? event.decodedTime.startsWith(formattedDateSearchTerm) : dateFilters.length === 0 || dateFilters.some(filterDate => event.decodedTime.startsWith(filterDate));

      return symbolMatch && chainMatch && reporterMatch && dateMatch;
    });

    setTableData(filteredData.slice(0, 6)); // Limit to first 6 items
    setFiltering(filteredData.length > 0);
  };

  // Effect hook to re-apply filters when any filter changes or the initial dataset updates
  useEffect(() => {
    handleFilterApply();
  }, [symbolFilters, chainFilters, reporterFilters, dateFilters, allData, dateSearchTerm]);

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
          setDateSearchTerm("") // Clear the date search term
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
                  onClick={() => handleClose('symbol')}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => handleClick('symbol')}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={symbolRef}
            >
              <h3>filter by symbol</h3>
              <input
  type="text"
  placeholder="Search..."
  value={symbolSearchTerm}
  onChange={(e) => setSymbolSearchTerm(e.target.value)}
/>
              <div className="DropdownResults">
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
                  onClick={() => handleClose('chain')}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => handleClick('chain')}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={chainRef}
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
                  onClick={() => handleClose('reporter')}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => handleClick('reporter')}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={reporterRef}
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
                  onClick={() => handleClose('date')}
                />
              ) : (
                <FilterIcon
                  className={
                    mode.mode === 'dark' ? 'FilterIcon' : 'FilterIconDark'
                  }
                  onClick={() => handleClick('date')}
                />
              )}
            </div>
            <div
              className={
                mode.mode === 'dark'
                  ? 'TableFilterDropdown'
                  : 'TableFilterDropdownDark'
              }
              ref={dateRef}
            >
              <h3>filter by date</h3>
              <input
                 type="date"
                 placeholder="Search..."
                 value={dateSearchTerm}
                 onChange={(e) => setDateSearchTerm(e.target.value)}
               />
              <div className="DropdownResults">
                {reportedDates &&
                  reportedDates.filter((date) => date.toLowerCase().includes(dateSearchTerm.toLowerCase()))
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
              <td className="TB__Symbols">{event.decodedValueName}</td>
              <td className="TB__Value">{event.decodedValue}</td>
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