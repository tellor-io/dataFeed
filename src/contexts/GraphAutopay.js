import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import { decodingAutopayMiddleware, sortDataByProperty  } from '../utils/helpers'
//Sort

export const GraphAutopayContext = createContext()

//ApolloClients

const clientMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorautopaymumbaihgraph',
  cache: new InMemoryCache(),
})

const clientMainnet = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-autopay-ethereum-graph',
  cache: new InMemoryCache(),
})

const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorautopaymatichgraph',
  cache: new InMemoryCache(),
})

const clientGoerli = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-autopay-goerli-graph',
  cache: new InMemoryCache(),
})

const clientSepolia = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-sepolia/v0.0.3',
  cache: new InMemoryCache(),
})

const clientOpmain = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellor-autopay-optimism-main',
  cache: new InMemoryCache(),
})

const clientPlsmain = new ApolloClient({
  uri: 'https://graph.pulse.domains/subgraphs/name/graphprotocol/tellor-autopay',
  cache: new InMemoryCache(),
})

const clientPlstest = new ApolloClient({
  uri: 'https://v4b.graph.pulse.domains/subgraphs/name/graphprotocol/tellor-autopay',
  cache: new InMemoryCache(),
})

const GraphAutopay = ({ children }) => {
  //Component State
  const [autopayMaticData, setAutopayMaticData] = useState({})
  const [autopayMainnetData, setAutopayMainnetData] = useState({})
  const [autopayMumbaiData, setAutopayMumbaiData] = useState({})
  const [autopayGoerliData, setAutopayGoerliData] = useState({})
  const [autopaySepoliaData, setAutopaySepoliaData] = useState({})
  const [autopayOpmainData, setAutopayOpmainData] = useState({})
  const [autopayPlsmainData, setAutopayPlsmainData] = useState({})
  const [autopayPlstestData, setAutopayPlstestData] = useState({})
  const [decodedData, setDecodedData] = useState([])
  const [allGraphData, setAllGraphData] = useState(null)
  //Context State
  //Matic
  const matic = useQuery(autopayQuery, {
    client: clientMatic,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Eth mainnet
  const mainnet = useQuery(autopayQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Mumbai
  const mumbai = useQuery(autopayQuery, {
    client: clientMumbai,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Goerli
  const goerli = useQuery(autopayQuery, {
    client: clientGoerli,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Sepolia
  const sepolia = useQuery(autopayQuery, {
    client: clientSepolia,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Optimism
  const opmain = useQuery(autopayQuery, {
    client: clientOpmain,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Pulsechain(mainnet)
  const plsmain = useQuery(autopayQuery, {
    client: clientPlsmain,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Pulsechain(testnet)
  const plstest = useQuery(autopayQuery, {
    client: clientPlstest,
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
      console.log(matic.data)

      setAutopayMaticData({})
    }
  }, [matic.data, matic.loading, matic.error]) //eslint-disable-line
  //Eth Mainnet
  useEffect(() => {
    if (!mainnet) return
    setAutopayMainnetData({
      data: mainnet.data,
      loading: mainnet.loading,
      error: mainnet.error,
    })
    return () => {
      setAutopayMainnetData({})
    }
  }, [mainnet.data, mainnet.loading, mainnet.error]) //eslint-disable-line*/
    //Goerli
    useEffect(() => {
      if (!goerli) return
      setAutopayGoerliData({
        data: goerli.data,
        loading: goerli.loading,
        error: goerli.error,
      })
      return () => {
        setAutopayGoerliData({})
      }
    }, [goerli.data, goerli.loading, goerli.error]) //eslint-disable-line*/
    //Sepolia
    useEffect(() => {
      if (!sepolia) return
      setAutopaySepoliaData({
        data: sepolia.data,
        loading: sepolia.loading,
        error: sepolia.error,
      })
      return () => {
        setAutopaySepoliaData({})
      }
    }, [sepolia.data, sepolia.loading, sepolia.error]) //eslint-disable-line*/
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
  //Optimism
  useEffect(() => {
    if (!opmain) return
    setAutopayOpmainData({
      data: opmain.data,
      loading: opmain.loading,
      error: opmain.error,
    })
    return () => {
      setAutopayOpmainData({})
    }
  }, [opmain.data, opmain.loading, opmain.error]) //eslint-disable-line
  //Pulsechain(mainnet)
  useEffect(() => {
    if (!plsmain) return
    setAutopayPlsmainData({
      data: plsmain.data,
      loading: plsmain.loading,
      error: plsmain.error,
    })
    return () => {
      setAutopayPlsmainData({})
    }
  }, [plsmain.data, plsmain.loading, plsmain.error]) //eslint-disable-line
  //Pulsechain(testnet)
  useEffect(() => {
    if (!plstest) return
    setAutopayPlstestData({
      data: plstest.data,
      loading: plstest.loading,
      error: plstest.error,
    })
    return () => {
      setAutopayPlstestData({})
    }
  }, [plstest.data, plstest.loading, plstest.error]) //eslint-disable-line
  //useEffects for decoding autopay events
  useEffect(() => {
    if (
      !autopayMaticData.data ||
      !autopayMainnetData.data ||
      !autopayGoerliData.data ||
      !autopaySepoliaData.data ||
      !autopayMumbaiData.data ||
      !autopayOpmainData.data ||
      !autopayPlsmainData.data ||
      !autopayPlstestData.data 
    )
      return

    let eventsArray = []

    autopayMaticData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Polygon Mainnet'
      event.txnLink = `https://polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMaticData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Polygon Mainnet'
      event.txnLink = `https://polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMumbaiData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Mumbai Testnet'
      event.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMumbaiData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Mumbai Testnet'
      event.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMainnetData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Ethereum Mainnet'
      event.txnLink = `https://etherscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayMainnetData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Ethereum Mainnet'
      event.txnLink = `https://etherscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayGoerliData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Goerli Testnet'
      event.txnLink = `https://goerli.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayGoerliData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Goerli Testnet'
      event.txnLink = `https://goerli.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopaySepoliaData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Sepolia Testnet'
      event.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopaySepoliaData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Sepolia Testnet'
      event.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayOpmainData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'Optimism Mainnet'
      event.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayOpmainData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'Optimism Mainnet'
      event.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayPlsmainData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'PulseChain (Mainnet)'
      event.txnLink = `https://scan.pulsechain.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayPlsmainData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'PulseChain (Mainnet)'
      event.txnLink = `https://scan.pulsechain.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayPlstestData.data.dataFeedEntities.forEach((event) => {
      event.chain = 'PulseChain (Testnet)'
      event.txnLink = `https://scan.v4.testnet.pulsechain.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    autopayPlstestData.data.tipAddedEntities.forEach((event) => {
      event.chain = 'PulseChain (Testnet)'
      event.txnLink = `https://scan.v4.testnet.pulsechain.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })
    let sorted = sortDataByProperty('_startTime', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [autopayMaticData, autopayMumbaiData, autopayMainnetData, autopayGoerliData, autopaySepoliaData, autopayOpmainData, autopayPlsmainData, autopayPlstestData])


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
    console.log(autopaySepoliaData)

  return (
    <GraphAutopayContext.Provider value={GraphContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay