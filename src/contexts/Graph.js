import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { reporterQuery, autopayQuery } from '../utils/queries'
import { decodingMiddleware, sortDataByProperty } from '../utils/helpers'

export const GraphContext = createContext()

//ApolloClients
const clientMainnet = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorxoraclemainhgraph',
  cache: new InMemoryCache(),
})
const clientRinkeby = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorxoraclerinkhgraph',
  cache: new InMemoryCache(),
})
const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorflexoraclematichgraph',
  cache: new InMemoryCache(),
})
const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorflexoraclemumbaihgraph',
  cache: new InMemoryCache(),
})
const clientOptkov = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellorflexoracleoptimismkovanhgraph',
  cache: new InMemoryCache(),
})

const Graph = ({ children }) => {
  //Component State
  const [graphMainnetData, setGraphMainnetData] = useState({})
  const [graphRinkebyData, setGraphRinkebyData] = useState({})
  const [graphMaticData, setGraphMaticData] = useState({})
  const [graphMumbaiData, setGraphMumbaiData] = useState({})
  const [graphOptkovData, setGraphOptkovData] = useState({})
  const [allGraphData, setAllGraphData] = useState(null)
  const [decodedData, setDecodedData] = useState(null)

  //Graph Querying every 5 seconds
  //Mainnet
  const mainnet = useQuery(reporterQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  const mainPay = useQuery(autopayQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Rinkeby
  const rinkeby = useQuery(reporterQuery, {
    client: clientRinkeby,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Matic
  const matic = useQuery(reporterQuery, {
    client: clientMatic,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Mumbai
  const mumbai = useQuery(reporterQuery, {
    client: clientMumbai,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //optimism(kovan)
  const optkov = useQuery(reporterQuery, {
    client: clientOptkov,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })

  console.log(mainPay, 'mainnet')
  //useEffects for listening to reponses
  //from ApolloClient queries
  //Mainnet
  useEffect(() => {
    if (!mainnet) return
    setGraphMainnetData({
      data: mainnet.data,
      loading: mainnet.loading,
      error: mainnet.error,
    })
    console.log('checker', mainnet.data)
    return () => {
      setGraphMainnetData({})
    }
  }, [mainnet.data, mainnet.loading, mainnet.error]) //eslint-disable-line
  //Rinkeby
  useEffect(() => {
    if (!rinkeby) return
    setGraphRinkebyData({
      data: rinkeby.data,
      loading: rinkeby.loading,
      error: rinkeby.error,
    })

    return () => {
      setGraphRinkebyData({})
    }
  }, [rinkeby.data, rinkeby.loading, rinkeby.error]) //eslint-disable-line
  //Matic
  useEffect(() => {
    if (!matic) return
    setGraphMaticData({
      data: matic.data,
      loading: matic.loading,
      error: matic.error,
    })

    return () => {
      setGraphMaticData({})
    }
  }, [matic.data, matic.loading, matic.error]) //eslint-disable-line
  //Mumbai
  useEffect(() => {
    if (!mumbai) return
    setGraphMumbaiData({
      data: mumbai.data,
      loading: mumbai.loading,
      error: mumbai.error,
    })

    return () => {
      setGraphMumbaiData({})
    }
  }, [mumbai.data, mumbai.loading, mumbai.error]) //eslint-disable-line
  //Optkov
  useEffect(() => {
    if (!optkov) return
    setGraphOptkovData({
      data: optkov.data,
      loading: optkov.loading,
      error: optkov.error,
    })

    return () => {
      setGraphOptkovData({})
    }
  }, [optkov.data, optkov.loading, optkov.error]) //eslint-disable-line

  //For conglomerating data
  useEffect(() => {
    if (
      !graphMainnetData.data ||
      !graphRinkebyData.data ||
      !graphMaticData.data ||
      !graphMumbaiData.data ||
      !graphOptkovData.data
    )
      return

    let eventsArray = []
    graphMainnetData.data.newReportEntities.forEach((event) => {
      event.chain = 'Ethereum Mainnet'
      event.txnLink = `https://etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    graphRinkebyData.data.newReportEntities.forEach((event) => {
      event.chain = 'Rinkeby Testnet'
      event.txnLink = `https://rinkeby.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    graphMaticData.data.newReportEntities.forEach((event) => {
      event.chain = 'Polygon Mainnet'
      event.txnLink = `https://polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    graphMumbaiData.data.newReportEntities.forEach((event) => {
      event.chain = 'Mumbai Testnet'
      event.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    graphOptkovData.data.newReportEntities.forEach((event) => {
      event.chain = 'Optimism Testnet'
      event.txnLink = `https://kovan-optimistic.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    let sorted = sortDataByProperty('_time', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [graphMainnetData, graphRinkebyData, graphMaticData, graphMumbaiData, graphOptkovData])

  useEffect(() => {
    if (!allGraphData) return
    setDecodedData(decodingMiddleware(allGraphData))

    return () => {
      setDecodedData(null)
    }
  }, [allGraphData])

  const GraphContextObj = {
    decodedData: decodedData,
  }

  // console.log('graphMainnetData', graphMainnetData)

  return (
    <GraphContext.Provider value={GraphContextObj}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph
