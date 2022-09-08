import React, { useState, createContext, useEffect, useContext } from 'react'
//Contexts
import { UserContext } from './User'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import { decodingAutopayMiddleware, sortDataByProperty  } from '../utils/helpers'
//Sort

export const GraphAutopayContext = createContext()

//ApolloClients

const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/seroxdesign/tellor-autopay-mumbai',
  cache: new InMemoryCache(),
})

const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/seroxdesign/tellor-autopay-mumbai',
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
    console.log('matic ', matic.data)
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
          
    console.log('mumbai ',mumbai.data)
    return () => {
      setAutopayMumbaiData({})
    }
  }, [mumbai.data, mumbai.loading, mumbai.error]) //eslint-disable-line
  //useEffects for decoding autopay events
  useEffect(() => {
    if (
      !autopayMaticData.data ||
      !autopayMumbaiData.data 
    )
      return

    let eventsArray = []

    autopayMaticData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Polygon Mainnet'
      event.txnLink = `https://polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMumbaiData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Mumbai Testnet'
      event.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    let sorted = sortDataByProperty('_startTime', eventsArray)
    setAllGraphData(sorted)

  }, [autopayMaticData.data])


  useEffect(() => {
    if (!allGraphData) return
    setDecodedData(decodingAutopayMiddleware(allGraphData))

    return () => {
      setDecodedData(null)
    }
  }, [allGraphData])


  const GraphContextObj = {
    decodedData: decodedData,
  }
  console.log('decoded ', GraphContextObj.decodedData)
 
  return (
    <GraphAutopayContext.Provider value={GraphContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay