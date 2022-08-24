import React, { useState, createContext, useEffect, useContext } from 'react'
//Contexts
import { UserContext } from './User'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import { decodingAutopayMiddleware } from '../utils/helpers'
//Sort
import { sortDataByProperty } from '../utils/helpers'

export const GraphAutopayContext = createContext()

//ApolloClients
const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joshuasamaniego/autopay-matic',
  cache: new InMemoryCache(),
})
const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joshuasamaniego/autopay-mumbai',
  cache: new InMemoryCache(),
})

const GraphAutopay = ({ children }) => {
  //Component State
  const [autopayMaticData, setAutopayMaticData] = useState({})
  const [autopayMumbaiData, setAutopayMumbaiData] = useState({})
  const [decodedData, setDecodedData] = useState(null)
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
    console.log('autopayMaticData', matic.data)
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
    console.log('autopayMaticData', matic.data)
    return () => {
      setAutopayMumbaiData({})
    }
  }, [mumbai.data, mumbai.loading, mumbai.error]) //eslint-disable-line

  //useEffects for decoding autopay events
  useEffect(() => {
    if (!autopayMaticData.data || !autopayMumbaiData.data ) return

    let eventsArray = []

    autopayMaticData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Polygon Mainnet'
      eventsArray.push(event)
      console.log(event)
    })
    autopayMumbaiData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Mumbai Testnet'
      eventsArray.push(event)
      console.log(event)
    })

    setAllGraphData(eventsArray)

    return () => {
      setAllGraphData(null)
    }
  }, [autopayMaticData.data, autopayMumbaiData.data])

  useEffect(() => {
    if (!allGraphData) return
    decodingAutopayMiddleware(allGraphData)
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
