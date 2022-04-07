import React, { useRef, useState } from 'react'
import '../styles/Table.css'
import { ReactComponent as FilterIcon } from '../assets/filter_outline.svg'
import { ReactComponent as FilterIconFilled } from '../assets/filter.svg'
//Icons
import { Jazzicon } from '@ukstv/jazzicon-react'
//Utils
import { truncateAddr } from '../utils/helpers'

function Table({ data, filterByItem, allData }) {
  //Component State
  const [symbolClicked, setSymbolClicked] = useState(false)
  const [chainClicked, setChainClicked] = useState(false)
  const [reporterClicked, setReporterClicked] = useState(false)
  //Refs
  const symbolRef = useRef()
  const chainRef = useRef()
  const reporterRef = useRef()

  console.log(data)
  //window operations
  // window.onclick = function (event) {
  //   console.log(event.target)
  //   if (symbolClicked) {
  //     if (event.target != symbolRef.current) {
  //       handleClose('symbol')
  //     }
  //   }
  // }

  //Handlers
  const handleClick = (iconType) => {
    let dropdown

    switch (iconType) {
      case 'symbol':
        setSymbolClicked(true)
        symbolRef.current.classList.add('display')
        console.log('here')
        break
      case 'chain':
        chainRef.current.classList.add('display')
        break
      case 'reporter':
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
        chainRef.current.classList.remove('display')
        break
      case 'reporter':
        reporterRef.current.classList.remove('display')
        break
      default:
        return
    }
  }

  // setTimeout(() => {
  //   console.log(symbolRef.current)
  //   console.log(chainRef.current)
  //   console.log(reporterRef.current)
  // }, 8000)

  return (
    <table className="Table">
      <thead className="TableHeaders">
        <tr className="TH__Header">
          <th>
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
            <div className="TableFilterDropdown" ref={symbolRef}>
              <h4>filter by symbol</h4>
            </div>
          </th>
          <th>
            <h1>VALUE</h1>
          </th>
          <th>
            <h1>CHAIN</h1>
            <FilterIcon
              className="FilterIcon"
              onClick={() => handleClick('chain')}
            />
            <div className="TableFilterDropdown" ref={chainRef}>
              <h4>filter by chain</h4>
            </div>
          </th>
          <th>
            <h1>REPORTER</h1>
            <FilterIcon
              className="FilterIcon"
              onClick={() => handleClick('reporter')}
            />
            <div className="TableFilterDropdown" ref={reporterRef}>
              <h4>filter by reporter</h4>
            </div>
          </th>
          <th>
            <h1>DATE/TIME</h1>
          </th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((event) => (
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
