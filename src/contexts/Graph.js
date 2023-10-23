import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { reporterQuery, autopayQuery } from '../utils/queries'
import { decodingMiddleware, sortDataByProperty } from '../utils/helpers'

export const GraphContext = createContext()

//ApolloClients
const clientMainnet = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/ad08435a6d6c0933c9e272dbdfa21322/subgraphs/id/4mgMy9x1FC6kzjXSQisntEKJFT2U7r73qXMZy2XZ1t4R',
  cache: new InMemoryCache(),
})
const clientMainnet2 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-flex-ethmain-graph2',
  cache: new InMemoryCache(),
})
const clientGoerli = new ApolloClient({
  uri: 'https://api.goldsky.com/api/public/project_clf8nopuy59a93stya1d02ev6/subgraphs/tellor-oracle-goerli/v0.0.1/gn',
  //'https://api.goldsky.com/api/public/project_clf8nopuy59a93stya1d02ev6/subgraphs/tellor-oracle-goerli/v0.0.1/gn',
  cache: new InMemoryCache(),
})
const clientSepolia = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-sepolia/v0.0.2',
  cache: new InMemoryCache(),
})
const clientSepolia2 = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-sepolia-subgraph2/v0.0.2',
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
const clientMumbai2 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-360-mumbai-subgraph',
  cache: new InMemoryCache(),
})
const clientArbone = new ApolloClient({
  uri: //'https://api.zondax.ch/fil/data/v1/mainnet/transactions/address/f1bkgyshmwpji4sltshvtyzf6yb7uraxr2pkwlamq?page=1',
  'https://api.thegraph.com/subgraphs/name/raynharr/tellor-flex-arbitrummain-graph',
  cache: new InMemoryCache(),
})
const clientArbtest = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellor-oracle-arbitrum-goerli',
  //'https://api.goldsky.com/api/public/project_clf8nopuy59a93stya1d02ev6/subgraphs/tellor-oracle-arbitrumtest/v0.0.1/gn',
  cache: new InMemoryCache(),
})
const clientGnosismain = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/ad08435a6d6c0933c9e272dbdfa21322/subgraphs/id/A614VZr6wqD4B8wNwiZTqrV6StP1Kvmp2AgG2EdJF31k',
  cache: new InMemoryCache(),
})
const clientOptmain = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellor-oracle-optimism-main',
  cache: new InMemoryCache(),
})

const Graph = ({ children }) => {
  //Component State
  const [graphMainnetData, setGraphMainnetData] = useState({})
  const [graphGoerliData, setGraphGoerliData] = useState({})
  const [graphSepoliaData, setGraphSepoliaData] = useState({})
  const [graphMaticData, setGraphMaticData] = useState({})
  const [graphMumbaiData, setGraphMumbaiData] = useState({})
  const [graphArboneData, setGraphArboneData] = useState({})
  const [graphArbtestData, setGraphArbtestData] = useState({})
  const [graphGnosismainData, setGraphGnosismainData] = useState({})
  const [graphOptmainData, setGraphOptmainData] = useState({})
  const [allGraphData, setAllGraphData] = useState(null)
  const [decodedData, setDecodedData] = useState(null)

  //Graph Querying every 5 seconds
  //Mainnet
  const mainnet = useQuery(reporterQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  const mainnet2 = useQuery(reporterQuery, {
    client: clientMainnet2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  /*const mainPay = useQuery(autopayQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })*/

   //Goerli
   const goerli = useQuery(reporterQuery, {
    client: clientGoerli,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  /*const goerliPay = useQuery(autopayQuery, {
    client: clientGoerli,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })*/
  //Sepolia
  const sepolia = useQuery(reporterQuery, {
    client: clientSepolia,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  console.log(sepolia);
  const sepolia2 = useQuery(reporterQuery, {
    client: clientSepolia2,
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
  const mumbai2 = useQuery(reporterQuery, {
    client: clientMumbai2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })

  //Arbitrum One (Main)
  const arbone = useQuery(reporterQuery, {
    client: clientArbone,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
    //Arbitrum Test (Goerli)
  const arbtest = useQuery(reporterQuery, {
    client: clientArbtest,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Gnosis Mainnet
  const gnosismain = useQuery(reporterQuery, {
    client: clientGnosismain,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //optimism(mainnet)
  const optmain = useQuery(reporterQuery, {
    client: clientOptmain,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })

  //useEffects for listening to reponses
  //from ApolloClient queries
  //Mainnet
  useEffect(() => {
    if (!mainnet.data && !mainnet2.data) return
    const combinedData = {
      ...mainnet.data,
      ...mainnet2.data,
      newReportEntities: [
        ...(mainnet.data?.newReportEntities || []),
        ...(mainnet2.data?.newReportEntities || [])
      ]
    }
    setGraphMainnetData({
      data: combinedData,
      loading: mainnet.loading || mainnet2.loading,
      error: mainnet.error || mainnet2.error,
    })
  
    return () => {
      setGraphMainnetData({})
    }
  }, [mainnet.data, mainnet.loading, mainnet.error, mainnet2.data, mainnet2.loading, mainnet2.error]) //eslint-disable-line

    //Goerli
    useEffect(() => {
      if (!goerli) return
      setGraphGoerliData({
        data: goerli.data,
        loading: goerli.loading,
        error: goerli.error,
      })
  
      return () => {
        setGraphGoerliData({})
      }
    }, [goerli.data, goerli.loading, goerli.error]) //eslint-disable-line
    //Sepolia
    useEffect(() => {
      if (!sepolia.data && !sepolia2.data) return
      const combinedData = {
        ...sepolia.data,
        ...sepolia2.data,
        newReportEntities: [
          ...(sepolia.data?.newReportEntities || []),
          ...(sepolia2.data?.newReportEntities || [])
        ]
      }
      setGraphSepoliaData({
        data: combinedData,
        loading: sepolia.loading || sepolia2.loading,
        error: sepolia.error || sepolia2.error,
      })
    
      return () => {
        setGraphSepoliaData({})
      }
    }, [sepolia.data, sepolia.loading, sepolia.error, sepolia2.data, sepolia2.loading, sepolia2.error]) //eslint-disable-line
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
    if (!mumbai.data && !mumbai2.data) return
    const combinedData = {
      ...mumbai.data,
      ...mumbai2.data,
      newReportEntities: [
        ...(mumbai.data?.newReportEntities || []),
        ...(mumbai2.data?.newReportEntities || [])
      ]
    }
    setGraphMumbaiData({
      data: combinedData,
      loading: mumbai.loading || mumbai2.loading,
      error: mumbai.error || mumbai2.error,
    })
  
    return () => {
      setGraphMumbaiData({})
    }
  }, [mumbai.data, mumbai.loading, mumbai.error, mumbai2.data, mumbai2.loading, mumbai2.error]) //eslint-disable-line
   //Arbitrum One
   useEffect(() => {
    if (!arbone) return
    setGraphArboneData({
      data: arbone.data,
      loading: arbone.loading,
      error: arbone.error,
    })

    return () => {
      setGraphArboneData({})
    }
  }, [arbone.data, arbone.loading, arbone.error]) //eslint-disable-line  
     //Arbitrum Test
     useEffect(() => {
      if (!arbtest) return
      setGraphArbtestData({
        data: arbtest.data,
        loading: arbtest.loading,
        error: arbtest.error,
      })
  
      return () => {
        setGraphArbtestData({})
      }
    }, [arbtest.data, arbtest.loading, arbtest.error]) //eslint-disable-line  
  //Gnosis Main
  useEffect(() => {
    if (!gnosismain) return
    setGraphGnosismainData({
      data: gnosismain.data,
      loading: gnosismain.loading,
      error: gnosismain.error,
    })

    return () => {
      setGraphGnosismainData({})
    }
  }, [gnosismain.data, gnosismain.loading, gnosismain.error]) //eslint-disable-line 
  //Optmain
  useEffect(() => {
    if (!optmain) return
    setGraphOptmainData({
      data: optmain.data,
      loading: optmain.loading,
      error: optmain.error,
    })

    return () => {
      setGraphOptmainData({})
    }
  }, [optmain.data, optmain.loading, optmain.error]) //eslint-disable-line

  //For conglomerating data
  useEffect(() => {
    if (
      !graphMainnetData.data ||
      !graphGoerliData.data ||
      !graphSepoliaData.data ||
      !graphMaticData.data ||
      !graphMumbaiData.data ||
      !graphArboneData.data ||
      !graphArbtestData.data ||
      !graphGnosismainData.data ||
      !graphOptmainData.data
    )
      return

    let eventsArray = []
  if (graphMainnetData.data && graphMainnetData.data.newReportEntities) {
  graphMainnetData.data.newReportEntities.forEach((event) => {
    const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
    updatedEvent.txnLink = `https://etherscan.io/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });
}

graphGoerliData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Goerli Testnet' });
  updatedEvent.txnLink = `https://goerli.etherscan.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

if (graphSepoliaData.data && graphSepoliaData.data.newReportEntities) {
  graphSepoliaData.data.newReportEntities.forEach((event) => {
   const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
    updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });
} 

graphMaticData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Polygon Mainnet' });
  updatedEvent.txnLink = `https://polygonscan.com/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

if (graphMumbaiData.data && graphMumbaiData.data.newReportEntities) {
  graphMumbaiData.data.newReportEntities.forEach((event) => {
    const updatedEvent = Object.assign({}, event, { chain: 'Mumbai Testnet' });
    updatedEvent.txnLink = `https://mumbai.polygonscan.com/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });
}

graphArboneData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Arbitrum Mainnet' });
  updatedEvent.txnLink = `https://arbiscan.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphArbtestData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Arbitrum Goerli' });
  updatedEvent.txnLink = `https://goerli.arbiscan.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphGnosismainData.data.newReportEntities.forEach((event) => {
const updatedEvent = Object.assign({}, event, { chain: 'Gnosis Mainnet' });
updatedEvent.txnLink = `https://gnosisscan.io/tx/${event.txnHash}`;
eventsArray.push(updatedEvent);
});

graphOptmainData.data.newReportEntities.forEach((event) => {
const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
updatedEvent.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`;
eventsArray.push(updatedEvent);
});
    let sorted = sortDataByProperty('_time', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [graphMainnetData, graphGoerliData, graphSepoliaData, graphMaticData, graphMumbaiData, graphArboneData, graphArbtestData, graphGnosismainData, graphOptmainData])

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

   console.log(graphSepoliaData)

  return (
    <GraphContext.Provider value={GraphContextObj}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph