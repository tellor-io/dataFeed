import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { autopayQuery } from '../utils/queries'
import { decodingAutopayMiddleware, sortDataByProperty  } from '../utils/helpers'
//Sort

export const GraphAutopayContext = createContext()

//ApolloClients

const clientAmoy = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-autopay-amoy-graph/version/latest',
  cache: new InMemoryCache(),
})

const clientMainnet = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/subgraphs/id/7DuTbaykjC37P2qjixWFsfLLknTzDdE5fbkDrtAXXJEL',
  cache: new InMemoryCache(),
  headers: {
    'Authorization': 'Bearer 95e299ffff2fab2572025a89a1243cbc'
  }
})

const clientSepolia = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/subgraphs/id/Ae4ByzjcYFkzH1ha53MwranjbFKvZfQuj5FCraevt7iy',
  cache: new InMemoryCache(),
  headers: {
    'Authorization': 'Bearer 95e299ffff2fab2572025a89a1243cbc'
  }
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
  console.log('Setting up autopay mainnet client:', clientMainnet);
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
  console.log('Setting up autopay sepolia client:', clientSepolia);
  const sepolia = useQuery(autopayQuery, {
    client: clientSepolia,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })

  // Add timeout for Sepolia query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sepolia.loading) {
        console.log('Sepolia query timed out after 10 seconds');
        setAutopaySepoliaData({
          data: null,
          loading: false,
          error: new Error('Sepolia query timeout')
        });
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [sepolia.loading]);
  
  //useEffects for listening to reponses
  //from ApolloClient queries
  
  //Eth Mainnet
  useEffect(() => {
    console.log('Autopay mainnet query state:', { data: mainnet.data, loading: mainnet.loading, error: mainnet.error });
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
    console.log('Autopay sepolia query state:', { data: sepolia.data, loading: sepolia.loading, error: sepolia.error });
    console.log('Sepolia network status:', sepolia.networkStatus);
    console.log('Sepolia called:', sepolia.called);
    if (!sepolia) return
    setAutopaySepoliaData({
      data: sepolia.data,
      loading: sepolia.loading,
      error: sepolia.error,
    })
    return () => {
      setAutopaySepoliaData({})
    }
  }, [sepolia.data, sepolia.loading, sepolia.error, sepolia.networkStatus, sepolia.called]) //eslint-disable-line*/
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
    console.log('Autopay data check:', {
      mainnet: !!autopayMainnetData.data,
      sepolia: !!autopaySepoliaData.data,
      amoy: !!autopayAmoyData.data,
      mainnetData: autopayMainnetData,
      sepoliaData: autopaySepoliaData,
      amoyData: autopayAmoyData
    });
    
    // Check if we have any data from any source
    const hasAnyData = autopayMainnetData.data || autopaySepoliaData.data || autopayAmoyData.data;
    
    if (!hasAnyData) {
      console.log('Skipping autopay processing - no data from any source');
      return;
    }
    
    let eventsArray = []
    
    console.log('Processing autopay data from available sources');

    // Process Amoy data if available
    if (autopayAmoyData.data) {
      if (autopayAmoyData.data.dataFeedEntities) {
        autopayAmoyData.data.dataFeedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
          updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
          eventsArray.push(updatedEvent);
        });
      }
      
      if (autopayAmoyData.data.tipAddedEntities) {
        autopayAmoyData.data.tipAddedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
          updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
          eventsArray.push(updatedEvent);
        });
      }
    }
    
    // Process Mainnet data if available
    if (autopayMainnetData.data) {
      if (autopayMainnetData.data.dataFeedEntities) {
        autopayMainnetData.data.dataFeedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
          updatedEvent.txnLink = `https://etherscan.com/tx/${event.txnHash}`;
          eventsArray.push(updatedEvent);
        });
      }
      
      if (autopayMainnetData.data.tipAddedEntities) {
        autopayMainnetData.data.tipAddedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
          console.log('Processing mainnet tip event:', event);
          console.log('Event txnHash:', event.txnHash);
          updatedEvent.txnLink = event.txnHash ? `https://etherscan.io/tx/${event.txnHash}` : 'https://etherscan.io';
          console.log('Created txnLink:', updatedEvent.txnLink);
          console.log('Testing URL construction - txnHash:', event.txnHash);
          console.log('Full URL should be:', `https://etherscan.com/tx/${event.txnHash}`);
          eventsArray.push(updatedEvent);
        });
      }
    }
    
    // Process Sepolia data if available
    console.log('Processing Sepolia autopay data:', autopaySepoliaData.data);
    if (autopaySepoliaData.data) {
      if (autopaySepoliaData.data.dataFeedEntities) {
        autopaySepoliaData.data.dataFeedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
          updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
          eventsArray.push(updatedEvent);
        });
      }
      
      if (autopaySepoliaData.data.tipAddedEntities) {
        autopaySepoliaData.data.tipAddedEntities.forEach((event) => {
          const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
          console.log('Processing sepolia tip event:', event);
          console.log('Sepolia event txnHash:', event.txnHash);
          updatedEvent.txnLink = event.txnHash ? `https://sepolia.etherscan.io/tx/${event.txnHash}` : 'https://sepolia.etherscan.io';
          console.log('Created sepolia txnLink:', updatedEvent.txnLink);
          eventsArray.push(updatedEvent);
        });
      }
    }
  
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
    
    console.log('Events array after processing:', eventsArray);
    console.log('Sample _startTime values:', eventsArray.slice(0, 3).map(e => ({ id: e.id, _startTime: e._startTime, chain: e.chain })));
    
    // Convert timestamps to numbers for proper sorting
    eventsArray.forEach(event => {
      if (event._startTime) {
        event._startTime = parseInt(event._startTime, 10);
      }
    });
    
    let sorted = sortDataByProperty('_startTime', eventsArray)
    console.log('Sorted events array:', sorted);
    console.log('Sample sorted _startTime values:', sorted.slice(0, 3).map(e => ({ id: e.id, _startTime: e._startTime, chain: e.chain })));
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
