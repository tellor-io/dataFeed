import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery, divaPayQuery, divaPayAdaptorQuery } from '../utils/queries'
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

const clientSepolia = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-sepolia/v0.0.5',
  cache: new InMemoryCache(),
})

const clientOpmain = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellor-autopay-optimism-main',
  cache: new InMemoryCache(),
})

const clientDivaMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/divaprotocol/diva-protocol-v1-polygon',
  cache: new InMemoryCache(),
})

const clientDivaAdaptorMumbai = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-adaptor-divamumbai',
  cache: new InMemoryCache(),
})


const GraphAutopay = ({ children }) => {
  //Component State
  const [autopayMaticData, setAutopayMaticData] = useState({})
  const [autopayMainnetData, setAutopayMainnetData] = useState({})
  const [autopayMumbaiData, setAutopayMumbaiData] = useState({})
  const [autopaySepoliaData, setAutopaySepoliaData] = useState({})
  const [autopayOpmainData, setAutopayOpmainData] = useState({})
  const [autopayDivaMumbaiData, setAutopayDivaMumbaiData] = useState({})
  const [autopayDivaAdaptorMumbaiData, setAutopayDivaAdaptorMumbaiData] = useState({})
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
  //Diva Polygon
  const divaMumbai = useQuery(divaPayQuery, {
    client: clientDivaMumbai,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //console.log(divaMumbai)
  const divaAdaptorMumbai = useQuery(divaPayAdaptorQuery, {
    client: clientDivaAdaptorMumbai,
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
      //console.log(matic.data)

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
  //Diva Mumbai
  useEffect(() => {
    if (!divaMumbai) return
    setAutopayDivaMumbaiData({
      data: divaMumbai.data,
      loading: divaMumbai.loading,
      error: divaMumbai.error,
    })
    return () => {
      setAutopayDivaMumbaiData({})
    }
  }, [divaMumbai.data, divaMumbai.loading, divaMumbai.error]) //eslint-disable-line
  //Diva Adaptor Mumbai
  useEffect(() => {
    if (!divaAdaptorMumbai) return
    setAutopayDivaAdaptorMumbaiData({
      data: divaAdaptorMumbai.data,
      loading: divaAdaptorMumbai.loading,
      error: divaAdaptorMumbai.error,
    })
    return () => {
      setAutopayDivaAdaptorMumbaiData({})
    }
  }, [divaAdaptorMumbai.data, divaAdaptorMumbai.loading, divaAdaptorMumbai.error]) //eslint-disable-line
  //useEffects for decoding autopay events
  useEffect(() => {
    if (
      !autopayMaticData.data ||
      !autopayMainnetData.data ||
      !autopaySepoliaData.data ||
      !autopayMumbaiData.data ||
      !autopayOpmainData.data ||
      !autopayDivaMumbaiData.data ||
      !autopayDivaAdaptorMumbaiData.data   
    )
      return

    let eventsArray = []

    autopayMaticData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Polygon Mainnet' });
      updatedEvent.txnLink = `https://polygonscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    })
    autopayMumbaiData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Mumbai Testnet' });
      updatedEvent.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    
    autopayMumbaiData.data.tipAddedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Mumbai Testnet' });
      updatedEvent.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`;
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
    
    autopayOpmainData.data.dataFeedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
      updatedEvent.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
    });
    autopayOpmainData.data.tipAddedEntities.forEach((event) => {
      const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
      updatedEvent.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`;
      eventsArray.push(updatedEvent);
      });

    autopayDivaMumbaiData.data.pools.forEach((event) => {
      if (event.dataProvider === '0x7950db13cc37774614b0aa406e42a4c4f0bf26a6') {
      const updatedEvent = Object.assign({}, event, { chain: 'Diva Polygon Mainnet' });
      updatedEvent.txnLink = `https://app.diva.finance/markets`;
      eventsArray.push(updatedEvent);
      }
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
  }, [autopayMaticData, autopayMumbaiData, autopayMainnetData, autopaySepoliaData, autopayOpmainData, autopayDivaMumbaiData, autopayDivaAdaptorMumbaiData])


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
    console.log(autopayDivaMumbaiData)

  return (
    <GraphAutopayContext.Provider value={GraphContextObj}>
      {children}
    </GraphAutopayContext.Provider>
  )
}

export default GraphAutopay
