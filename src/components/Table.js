import React, { useEffect, useRef, useState } from 'react'
import '../styles/Table.css'
import { ReactComponent as FilterIcon } from '../assets/filter_outline.svg'
import { ReactComponent as FilterIconFilled } from '../assets/filter.svg'
import { ReactComponent as Checked } from '../assets/done.svg'
//Icons
import { Jazzicon } from '@ukstv/jazzicon-react'
//Utils
import { truncateAddr } from '../utils/helpers'

function Table({ data, filterByItem, allData }) {
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
  //
  const [allFilters, setAllFilters] = useState([])
  const [symbolFilters, setSymbolFilters] = useState([])
  const [chainFilters, setChainFilters] = useState([])
  const [reporterFilters, setReporterFilters] = useState([])
  //Refs
  const symbolRef = useRef()
  const chainRef = useRef()
  const reporterRef = useRef()

  // console.log(data)
  //useEffect for tableData
  useEffect(() => {
    setTableData(data)
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
        symbols.push(event.decodedValueName)
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
  }, [allData && allData.decodedData])

  //Handlers
  const handleClick = (iconType) => {
    let dropdown

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
    filterByItem('symbol', allData)
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
    let allFiltersObj = { filterType: filterType, filterValue: filterValue }
    switch (filterType) {
      case 'symbol':
        if (symbolFilters.includes(filterValue)) {
          temp = symbolFilters.filter((filters) => filters !== filterValue)
          setSymbolFilters(temp)
          setAllFilters([...allFilters, allFiltersObj])
        } else {
          setSymbolFilters([...symbolFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      case 'chain':
        if (chainFilters.includes(filterValue)) {
          temp = chainFilters.filter((filters) => filters !== filterValue)
          setChainFilters(temp)
          setAllFilters([...allFilters, allFiltersObj])
        } else {
          setChainFilters([...chainFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      case 'reporter':
        if (reporterFilters.includes(filterValue)) {
          temp = reporterFilters.filter((filters) => filters !== filterValue)
          setReporterFilters(temp)
          setAllFilters([...allFilters, allFiltersObj])
        } else {
          setReporterFilters([...reporterFilters, filterValue])
          setAllFilters([...allFilters, allFiltersObj])
        }
        break
      default:
        return
    }
  }
  const handleFilterApply = (filterType) => {
    let filteredData = []
    if (allFilters.length > 0) {
      allData.decodedData.forEach((event) => {
        allFilters.forEach((filter) => {
          if (
            filter.filterValue === event.decodedValueName ||
            filter.filterValue === event.chain ||
            filter.filterValue === event.decodedReporter
          ) {
            filteredData.push(event)
          }
        })
      })
    } else {
      setTableData(data)
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
    setTableData(filteredData)
  }
  const handleFilterClear = (filterType) => {
    switch (filterType) {
      case 'symbol':
        handleClose('symbol')
        allFilters.forEach((filter) => {
          if (filter.filterType === 'symbol') {
            allFilters.pop()
          }
        })
        handleFilterApply()
        setSymbolFilters([])
        break
      case 'chain':
        handleClose('chain')
        allFilters.forEach((filter) => {
          if (filter.filterType === 'chain') {
            allFilters.pop()
          }
        })
        setChainFilters([])
        break
      case 'reporter':
        handleClose('reporter')
        allFilters.forEach((filter) => {
          if (filter.filterType === 'reporter') {
            allFilters.pop()
          }
        })
        setReporterFilters([])
        break
      default:
        return
    }
  }

  console.log(allFilters)

  return (
    <table className="Table">
      <thead className="TableHeaders">
        <tr className="TH__Header">
          <th className="TH__HeaderSpecial">
            <div className="TH__HeaderDiv">
              <h1>SYMBOLS</h1>
              {symbolClicked ? (
                <FilterIconFilled
                  className="FilterIcon"
                  onClick={() => handleClose('symbol')}
                />
              ) : (
                <FilterIcon
                  className="FilterIcon"
                  onClick={() => handleClick('symbol')}
                />
              )}
            </div>
            <div className="TableFilterDropdown" ref={symbolRef}>
              <h3>filter by symbol</h3>
              <div className="DropdownResults">
                {reportedSymbols &&
                  reportedSymbols.map((symbol) => (
                    <div
                      key={symbol}
                      className="DropdownDataRow"
                      onClick={() => handleFilter('symbol', symbol)}
                    >
                      {symbolFilters.includes(symbol) ? (
                        <>
                          <p>{symbol}</p>
                          <Checked />
                        </>
                      ) : (
                        <p>{symbol}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div className="DropdownButtons">
                <button
                  className="DropdownApply"
                  onClick={() => handleFilterApply('symbol')}
                >
                  Apply
                </button>
                <button
                  className="DropdownClear"
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
                  className="FilterIcon"
                  onClick={() => handleClose('chain')}
                />
              ) : (
                <FilterIcon
                  className="FilterIcon"
                  onClick={() => handleClick('chain')}
                />
              )}
            </div>
            <div className="TableFilterDropdown" ref={chainRef}>
              <h3>filter by chain</h3>
              <div className="DropdownResults">
                {reportedChains &&
                  reportedChains.map((chain) => (
                    <div
                      key={chain}
                      className="DropdownDataRow"
                      onClick={() => handleFilter('chain', chain)}
                    >
                      {chainFilters.includes(chain) ? (
                        <>
                          <p>{chain}</p>
                          <Checked />
                        </>
                      ) : (
                        <p>{chain}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div className="DropdownButtons">
                <button
                  className="DropdownApply"
                  onClick={() => handleFilterApply('chain')}
                >
                  Apply
                </button>
                <button
                  className="DropdownClear"
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
                  className="FilterIcon"
                  onClick={() => handleClose('reporter')}
                />
              ) : (
                <FilterIcon
                  className="FilterIcon"
                  onClick={() => handleClick('reporter')}
                />
              )}
            </div>
            <div className="TableFilterDropdown" ref={reporterRef}>
              <h3>filter by reporter</h3>
              <div className="DropdownResults">
                {reportedReporters &&
                  reportedReporters.map((reporter) => (
                    <div
                      key={reporter}
                      className="DropdownDataRow"
                      onClick={() => handleFilter('reporter', reporter)}
                    >
                      {reporterFilters.includes(reporter) ? (
                        <>
                          <p>{truncateAddr(reporter)}</p>
                          <Checked />
                        </>
                      ) : (
                        <p>{truncateAddr(reporter)}</p>
                      )}
                    </div>
                  ))}
              </div>
              <div className="DropdownButtons">
                <button
                  className="DropdownApply"
                  onClick={() => handleFilterApply('reporter')}
                >
                  Apply
                </button>
                <button
                  className="DropdownClear"
                  onClick={() => handleFilterClear('reporter')}
                >
                  Clear
                </button>
              </div>
            </div>
          </th>
          <th>
            <h1>DATE/TIME</h1>
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData &&
          tableData.map((event) => (
            <tr key={event.id} className="TableBody">
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
          ))}
      </tbody>
    </table>
  )
}

export default Table
