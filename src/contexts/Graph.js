import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { useQuery } from '@apollo/client'
//Utils
// import { appQuery } from '../utils/queries'

export const GraphContext = createContext()

const Graph = ({ children }) => {
  //Component State
  const [graphData, setGraphData] = useState({})
  //Graph Querying every 5 seconds
  //   const { loading, error, data } = useQuery(appQuery, {
  //     fetchPolicy: 'network-only',
  //     pollInterval: 5000,
  //   })

  //   useEffect(() => {
  //     if (!data) return
  //     setGraphData({
  //       data: data,
  //       loading: loading,
  //       error: error,
  //     })
  //   }, [data, loading, error])

  const GraphContextObj = {
    graphData: graphData,
  }
  console.log('graphData', graphData)

  return (
    <GraphContext.Provider value={GraphContextObj}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph
