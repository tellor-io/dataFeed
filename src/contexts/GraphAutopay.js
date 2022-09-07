import React, { useState, createContext, useEffect, useContext } from 'react'
//Contexts
import { UserContext } from './User'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import { decodingAutopayMiddleware } from '../utils/helpers'
//Sort

export const GraphAutopayContext = createContext()

//ApolloClients
const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorautopaymatichgraph',
  cache: new InMemoryCache(),
})
const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorautopaymumbaihgraph',
  cache: new InMemoryCache(),
})

const GraphAutopay = ({ children }) => {
  //Component State
  const [autopayMaticData, setAutopayMaticData] = useState({})
  const [autopayMumbaiData, setAutopayMumbaiData] = useState({})
  const [decodedData, setDecodedData] = useState([])
  const [allGraphData, setAllGraphData] = useState(null)
  //Context State
  const user = useContext(UserContext)
  //Matic
  const matic = useQuery(autopayQuery, {
    client: clientMatic,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Mumbai
  const mumbai = useQuery(autopayQuery, {
    client: clientMumbai,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  
  //useEffects for listening to reponses
  //from ApolloClient queries
  //Matic
  useEffect(() => {
    if (!matic) return
    setAutopayMaticData({
      data: matic.data,
      loading: matic.loading,
      error: matic.error,
    })
    return () => {
      setAutopayMaticData({})
    }
  }, [matic.data, matic.loading, matic.error]) //eslint-disable-line
  //Mumbai
  useEffect(() => {
    if (!mumbai) return
    setAutopayMumbaiData({
      data: mumbai.data,
      loading: mumbai.loading,
      error: mumbai.error,
    })
    return () => {
      setAutopayMumbaiData({})
    }
  }, [matic.data, matic.loading, matic.error]) //eslint-disable-line
  //useEffects for decoding autopay events
  useEffect(() => {
    if (autopayMaticData.data === undefined || autopayMumbaiData.data === undefined) return
    let eventsArray = []
    
    autopayMaticData.data.newDataFeedEntities.forEach((event) => {
      event.chain = 'Matic Mainnet'
      eventsArray.push(event)
    })
    
    setAllGraphData(eventsArray)

    return () => {
      setAllGraphData(null)
    }
  }, [autopayMaticData.data])


  useEffect(() => {
    if (!allGraphData) return

    setDecodedData(...decodedData, decodingAutopayMiddleware(allGraphData, user))

    return () => {
      setDecodedData(null)
    }
  }, [allGraphData])

  const GraphAutopayContextObj = {
    decodedData: decodedData,
  }

  return (
    <GraphAutopayContext.Provider value={GraphAutopayContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay
