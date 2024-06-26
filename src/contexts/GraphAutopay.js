import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery, divaPayQuery, divaPayAdaptorQuery } from '../utils/queries'
import { decodingAutopayMiddleware, sortDataByProperty  } from '../utils/helpers'
//Sort

export const GraphAutopayContext = createContext()

//ApolloClients

const clientAmoy = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-amoy-graph/version/latest',
  cache: new InMemoryCache(),
})

const clientMainnet = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-ethereum-graph/version/latest',
  cache: new InMemoryCache(),
})

const clientSepolia = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-sepolia/v0.0.5',
  cache: new InMemoryCache(),
})


const GraphAutopay = ({ children }) => {
  //Component State
  const [autopayMainnetData, setAutopayMainnetData] = useState({})
  const [autopayAmoyData, setAutopayAmoyData] = useState({})
  const [autopaySepoliaData, setAutopaySepoliaData] = useState({})
  const [decodedData, setDecodedData] = useState([])
  const [allGraphData, setAllGraphData] = useState(null)
  //Context State

  //Eth mainnet
  const mainnet = useQuery(autopayQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Amoy
  const amoy = useQuery(autopayQuery, {
    client: clientAmoy,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Sepolia
  const sepolia = useQuery(autopayQuery, {
    client: clientSepolia,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  
  //useEffects for listening to reponses
  //from ApolloClient queries
  
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
  //Amoy
  useEffect(() => {
    if (!amoy) return
    setAutopayAmoyData({
      data: amoy.data,
      loading: amoy.loading,
      error: amoy.error,
    })
    return () => {
      setAutopayAmoyData({})
    }
  }, [amoy.data, amoy.loading, amoy.error]) //eslint-disable-line
  //useEffects for decoding autopay events
  useEffect(() => {
    if (
      !autopayMainnetData.data ||
      !autopaySepoliaData.data ||
      !autopayAmoyData.data 
    )
      return

    let eventsArray = []

    autopayAmoyData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
      updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopayAmoyData.data.tipAddedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
      updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopayMainnetData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
      updatedEvent.txnLink = `https://etherscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopayMainnetData.data.tipAddedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
      updatedEvent.txnLink = `https://etherscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopaySepoliaData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
      updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopaySepoliaData.data.tipAddedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
      updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
  
    /*autopayDivaMumbaiData.data.feeRecipients.forEach((event) => {
      event.chain = 'Diva Polygon Mainnet'
      event.txnLink = `https://polygonscan.com/tx/${event.txnHash}`
      eventsArray.push(event)
    })

    autopayDivaAdaptorMumbaiData.data.tipAddeds.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Diva Polygon Mainnet' });
      updatedEvent.txnLink = `https://app.diva.finance/markets`;
      });
      */
    
    let sorted = sortDataByProperty('_startTime', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [ autopayAmoyData, autopayMainnetData, autopaySepoliaData])


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

  return (
    <GraphAutopayContext.Provider value={GraphContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay
