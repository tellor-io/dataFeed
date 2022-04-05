import React, { useContext, useEffect, useState } from 'react'
import '../styles/AllFeeds.css'
import Table from './Table'
//Context
import { GraphContext } from '../contexts/Graph'

function AllFeeds() {
  //Context State
  const data = useContext(GraphContext)
  //Component State
  const [clippedData, setClippedData] = useState(null)

  useEffect(() => {
    if (!data && !data.decodedData) return
    setClippedData(data.decodedData.slice(0, 51))

    return () => {
      setClippedData(null)
    }
  }, [data])

  return (
    <div>
      <Table data={clippedData} />
      <button className="AllFeeds__Button">load more</button>
    </div>
  )
}

export default AllFeeds
