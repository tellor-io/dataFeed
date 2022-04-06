import React from 'react'
import '../styles/Table.css'
import { ReactComponent as FilterIcon } from '../assets/filter_icon.svg'
//Icons
import { Jazzicon } from '@ukstv/jazzicon-react'
//Utils
import { truncateAddr } from '../utils/helpers'

function Table({ data }) {
  console.log(data)
  return (
    <table className="Table">
      <thead className="TableHeaders">
        <tr className="TH__Header">
          <th>
            <h1>SYMBOLS</h1>
            <FilterIcon />
          </th>
          <th>
            <h1>VALUE</h1>
            <FilterIcon />
          </th>
          <th>
            <h1>CHAIN</h1>
            <FilterIcon />
          </th>
          <th>
            <h1>REPORTER</h1>
            <FilterIcon />
          </th>
          <th>
            <h1>DATE/TIME</h1>
            <FilterIcon />
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
