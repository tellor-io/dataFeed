import React from 'react'
import '../styles/Table.css'
import { ReactComponent as FilterIcon } from '../assets/filter_icon.svg'
//Icons
import { Jazzicon } from '@ukstv/jazzicon-react'

function Table() {
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
        <tr className="TableBody">
          <td className="TB__Symbols">BTC/USD</td>
          <td className="TB__Value">45,239.45</td>
          <td className="TB__Chain">Ethereum Mainnet</td>
          <td className="TB__Reporter">
            <Jazzicon
              address="0xfeDD097584e25114e6dd23778329a2520F418800"
              className="Table__Jazzicon"
            />
            <p>0xfeDD...8800</p>
          </td>
          <td className="TB__DateTime">DD/MM/YYYY, HH:MM:SS</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Table
