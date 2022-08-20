import React, { useState, createContext, useEffect, useContext } from 'react'
//Contexts
import { UserContext } from './User'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import autopayABI from '../utils/autopayABI.json'

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
  //Helpers
  const decodingAutopayMiddleware = (autopayEvents) => {
    if (!user.currentUser) return
    //Globals
    let feedFundedEntities = autopayEvents.data.dataFeedFundedEntities
    let setupFeedEntities = autopayEvents.data.newDataFeedEntities
    let feedIdParams = {}
    //Contract Instances
    const autopayContractMatic = new user.currentUser.web3.eth.Contract(
      autopayABI,
      '0x671d444D1fF68393d260D754c2303B9a4f51a8E8'
    )
    const autopayContractMumbai = new user.currentUser.web3.eth.Contract(
      autopayABI,
      '0xf27C4d5551a9127D649E2b99f6Ffa9604B85973d'
    )

    console.log('feedFundedEntities', feedFundedEntities)
    console.log('setupFeedEntities', setupFeedEntities)

    if (user.currentUser.network === 'matic') {
      feedFundedEntities.map((event) => {
        autopayContractMatic.methods
          .getDataFeed(event._feedId, event._queryId)
          .call()
          .then((res) => {
            console.log('res', res)
            feedIdParams.balance = res.balance
            feedIdParams.interval = res.interval
            feedIdParams.reward = res.reward
            feedIdParams.startTime = res.startTime
            feedIdParams.token = res.token
            feedIdParams.window = res.window
            event.feedIdParams = feedIdParams
            return event
          })
          .catch((err) =>
            console.log('Error in autopay contract call', err.message)
          )
      })
      return
    } else if (user.currentUser.network === 'mumbai') {
      feedFundedEntities.map((event) => {
        autopayContractMumbai.methods
          .getDataFeed(event._feedId, event._queryId)
          .call()
          .then((res) => {
            console.log('res', res)
            feedIdParams.balance = res.balance
            feedIdParams.interval = res.interval
            feedIdParams.reward = res.reward
            feedIdParams.startTime = res.startTime
            feedIdParams.token = res.token
            feedIdParams.window = res.window
            event.feedIdParams = feedIdParams
            return event
          })
          .catch((err) =>
            console.log('Error in autopay contract call', err.message)
          )
      })
      return
    }
    return
  }

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
  }, [mumbai.data, mumbai.loading, mumbai.error]) //eslint-disable-line

  useEffect(() => {
    if (!autopayMaticData || !autopayMumbaiData || !user.currentUser) return

    if (user.currentUser.network === 'matic') {
      setDecodedData(decodingAutopayMiddleware(autopayMaticData))
    } else if (user.currentUser.network === 'mumbai') {
      setDecodedData(decodingAutopayMiddleware(autopayMumbaiData))
    }

    return () => {
      setDecodedData(null)
    }
  }, [
    autopayMaticData,
    autopayMumbaiData,
    user.currentUser && user.currentUser.network,
  ]) //eslint-disable-line

  const GraphAutopayContextObj = {
    decodedData: decodedData,
  }

  console.log('decodedData something', decodedData)

  return (
    <GraphAutopayContext.Provider value={GraphAutopayContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay
