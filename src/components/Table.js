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
  //
  const [reportedSymbols, setReportedSymbols] = useState(null)
  const [reportedChains, setReportedChains] = useState(null)
  const [reportedReporters, setReportedReporters] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  //
  const [allFilters, setAllFilters] = useState([])
  const [symbolFilters, setSymbolFilters] = useState([])
  const [chainFilters, setChainFilters] = useState([])
  const [reporterFilters, setReporterFilters] = useState([])
  //Refs
  const symbolRef = useRef()
  const chainRef = useRef()
  const reporterRef = useRef()
  //Contexts
  const mode = useContext(ModeContext)

  // console.log(data)
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
    })
    setReportedSymbols(symbols)
    setReportedChains(chains)
    setReportedReporters(reporters)

    return () => {
      setReportedSymbols(null)
      setReportedChains(null)
      setReportedReporters(null)
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
      default:
        return
    }
  }
  const handleFilterApply = (filterType, cleared) => {
    let filteredData = []
    let symbolFilter = false
    let symbols = []
    let chainFilter = false
    let chains = []
    let reporterFilter = false
    let reporters = []
    //
    let makesTheCut = []

    if (cleared) {
      if (cleared.length > 0) {
        allData.decodedData.forEach((event) => {
          cleared.forEach((filter) => {
            if (filter.filterType === 'symbol') {
              symbolFilter = true
              if (!symbols.includes(filter.filterValue)) {
                symbols.push(filter.filterValue)
              }
            } else if (filter.filterType === 'chain') {
              chainFilter = true
              if (!chains.includes(filter.filterValue)) {
                chains.push(filter.filterValue)
              }
            } else if (filter.filterType === 'reporter') {
              reporterFilter = true
              if (!reporters.includes(filter.filterValue)) {
                reporters.push(filter.filterValue)
              }
            }

            switch (true) {
              //For all 3 filterTypes
              case symbolFilter && chainFilter && reporterFilter:
                symbols.forEach((symbol) => {
                  chains.forEach((chain) => {
                    reporters.forEach((reporter) => {
                      if (
                        (filter.filterValue === event.decodedValueName ||
                          filter.filterValue === event.feedType) &&
                        event.chain === chain &&
                        event.decodedReporter === reporter
                      ) {
                        if (makesTheCut.includes(event)) {
                        } else {
                          makesTheCut.push(event)
                        }
                      }
                    })
                  })
                })
                break
              //For 2 filterTypes
              case symbolFilter && chainFilter:
                symbols.forEach((symbol) => {
                  chains.forEach((chain) => {
                    if (
                      (filter.filterValue === event.decodedValueName ||
                        filter.filterValue === event.feedType) &&
                      event.chain === chain
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              case symbolFilter && reporterFilter:
                symbols.forEach((symbol) => {
                  reporters.forEach((reporter) => {
                    if (
                      (filter.filterValue === event.decodedValueName ||
                        filter.filterValue === event.feedType) &&
                      event.decodedReporter === reporter
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              case chainFilter && reporterFilter:
                chains.forEach((chain) => {
                  reporters.forEach((reporter) => {
                    if (
                      event.chain === chain &&
                      event.decodedReporter === reporter
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              //For single category filterTypes
              case symbolFilter:
                if (
                  filter.filterValue === event.decodedValueName ||
                  filter.filterValue === event.feedType
                ) {
                  filteredData.push(event)
                }
                break
              case chainFilter:
                if (filter.filterValue === event.chain) {
                  filteredData.push(event)
                }
                break
              case reporterFilter:
                if (filter.filterValue === event.decodedReporter) {
                  filteredData.push(event)
                }
                break
              default:
                return
            }
          })
        })
        if (makesTheCut.length > 0) {
          setTableData(makesTheCut)
        } else {
          setTableData(filteredData)
        }
        setFiltering(true)
      } else {
        setTableData(data)
        setFiltering(false)
      }
    } else {
      if (allFilters.length > 0) {
        allData.decodedData.forEach((event) => {
          allFilters.forEach((filter) => {
            if (filter.filterType === 'symbol') {
              symbolFilter = true
              if (!symbols.includes(filter.filterValue)) {
                symbols.push(filter.filterValue)
              }
            } else if (filter.filterType === 'chain') {
              chainFilter = true
              if (!chains.includes(filter.filterValue)) {
                chains.push(filter.filterValue)
              }
            } else if (filter.filterType === 'reporter') {
              reporterFilter = true
              if (!reporters.includes(filter.filterValue)) {
                reporters.push(filter.filterValue)
              }
            }

            switch (true) {
              //For all 3 filterTypes
              case symbolFilter && chainFilter && reporterFilter:
                symbols.forEach((symbol) => {
                  chains.forEach((chain) => {
                    reporters.forEach((reporter) => {
                      if (
                        (event.decodedValueName === symbol ||
                          event.feedType === symbol) &&
                        event.chain === chain &&
                        event.decodedReporter === reporter
                      ) {
                        if (makesTheCut.includes(event)) {
                        } else {
                          makesTheCut.push(event)
                        }
                      }
                    })
                  })
                })
                break
              //For 2 filterTypes
              case symbolFilter && chainFilter:
                symbols.forEach((symbol) => {
                  chains.forEach((chain) => {
                    if (
                      (event.decodedValueName === symbol ||
                        event.feedType === symbol) &&
                      event.chain === chain
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              case symbolFilter && reporterFilter:
                symbols.forEach((symbol) => {
                  reporters.forEach((reporter) => {
                    if (
                      (event.decodedValueName === symbol ||
                        event.feedType === symbol) &&
                      event.decodedReporter === reporter
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              case chainFilter && reporterFilter:
                chains.forEach((chain) => {
                  reporters.forEach((reporter) => {
                    if (
                      event.chain === chain &&
                      event.decodedReporter === reporter
                    ) {
                      if (makesTheCut.includes(event)) {
                      } else {
                        makesTheCut.push(event)
                      }
                    }
                  })
                })
                break
              //For single category filterTypes
              case symbolFilter:
                if (
                  filter.filterValue === event.decodedValueName ||
                  filter.filterValue === event.feedType
                ) {
                  filteredData.push(event)
                }
                break
              case chainFilter:
                if (filter.filterValue === event.chain) {
                  filteredData.push(event)
                }
                break
              case reporterFilter:
                if (filter.filterValue === event.decodedReporter) {
                  filteredData.push(event)
                }
                break
              default:
                return
            }
          })
        })
        if (makesTheCut.length > 0) {
          setTableData(makesTheCut)
        } else {
          setTableData(filteredData)
        }
        setFiltering(true)
      } else {
        setTableData(data)
        setFiltering(false)
      }
    }

    switch (filterType) {
      case 'symbol':
        handleClose('symbol')
        break
      case 'chain':
        handleClose('chain')
        break
      case 'reporter':
        handleClose('reporter')
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
        handleFilterApply('symbol', cleared)
        setSymbolFilters([])
        break
      case 'chain':
        cleared = allFilters.filter(
          (filters) => filters.filterType !== filterType
        )
        setAllFilters(cleared)
        handleFilterApply('chain', cleared)
        setChainFilters([])
        break
      case 'reporter':
        cleared = allFilters.filter(
          (filters) => filters.filterType !== filterType
        )
        setAllFilters(cleared)
        handleFilterApply('reporter', cleared)
        setReporterFilters([])
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
              <div className="DropdownResults">
                {reportedSymbols &&
                  reportedSymbols.map((symbol) => (
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
                  className="DropdownApply"
                  onClick={() => handleFilterApply('symbol')}
                >
                  Apply
                </button>
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
                  className="DropdownApply"
                  onClick={() => handleFilterApply('chain')}
                >
                  Apply
                </button>
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
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
              <div className="DropdownResults">
                {reportedReporters &&
  reportedReporters
  .filter((reporter) => reporter.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  className="DropdownApply"
                  onClick={() => handleFilterApply('reporter')}
                >
                  Apply
                </button>
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
          <th>
            <h1>DATE(DD/MM/YY), TIME</h1>
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
