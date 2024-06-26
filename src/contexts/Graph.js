import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { reporterQuery, autopayQuery } from '../utils/queries'
import { decodingMiddleware, sortDataByProperty } from '../utils/helpers'

export const GraphContext = createContext()

//ApolloClients
const clientMainnet = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellororaclemainhgraph/version/latest',
  cache: new InMemoryCache(),
})

const clientSepolia = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-sepolia-graph/version/latest',
  cache: new InMemoryCache(),
})

const clientMatic = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-matic-graph2/version/latest',
  cache: new InMemoryCache(),
})
const clientAmoy = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-amoy-test-subgr/version/latest',
  cache: new InMemoryCache(),
})

const clientArbone = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-arbitrummain-graph/version/latest',
  cache: new InMemoryCache(),
})

const clientGnosismain = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-matic-graph2/version/latest',
  cache: new InMemoryCache(),
})
const clientOptMain = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-optmain-graph2/version/latest',
  cache: new InMemoryCache(),
})
const clientOptTest = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-optimism-testnet/version/latest',
  cache: new InMemoryCache(),
})
const clientLinea = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-main/v0.0.1',
  cache: new InMemoryCache(), 
})
const clientLineaTest = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-tesnet/version/latest',
  cache: new InMemoryCache(), 
})
const clientPolygonzk = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-polygonzk-main/v0.0.1',
  cache: new InMemoryCache(),
})
const clientZksyncmain = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-zksync-main-subg/version/latest',
  cache: new InMemoryCache(),
})
const clientZksynctest = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-zksync-test-subg/version/latest',
  cache: new InMemoryCache(),
})

const Graph = ({ children }) => {
  //Component State
  const [graphMainnetData, setGraphMainnetData] = useState({})
  const [graphSepoliaData, setGraphSepoliaData] = useState({})
  const [graphMaticData, setGraphMaticData] = useState({})
  const [graphAmoyData, setGraphAmoyData] = useState({})
  const [graphArboneData, setGraphArboneData] = useState({})
  const [graphGnosismainData, setGraphGnosismainData] = useState({})
  const [graphOptMainData, setGraphOptMainData] = useState({})
  const [graphOptTestData, setGraphOptTestData] = useState({})
  const [graphLineaData, setGraphLineaData] = useState({})
  const [graphLineaTestData, setGraphLineaTestData] = useState({})
  const [graphPolygonzkData, setGraphPolygonzkData] = useState({})
  const [graphZksyncMainData, setGraphZksyncMainData] = useState({})
  const [graphZksyncTestData, setGraphZksyncTestData] = useState({})
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
  //Sepolia
  const sepolia = useQuery(reporterQuery, {
    client: clientSepolia,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Matic
  const matic = useQuery(reporterQuery, {
    client: clientMatic,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Amoy
  const amoy = useQuery(reporterQuery, {
    client: clientAmoy,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Arbitrum One (Main)
  const arbone = useQuery(reporterQuery, {
    client: clientArbone,
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
    client: clientOptMain,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
   //optimism(testnet)
   const opttest = useQuery(reporterQuery, {
    client: clientOptTest,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Linea
  const linea = useQuery(reporterQuery, {
    client: clientLinea,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Linea Testnet
     const lineaTest = useQuery(reporterQuery, {
      client: clientLineaTest,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    })
     //polygonzkevm
     const polygonzk = useQuery(reporterQuery, {
      client: clientPolygonzk,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    })
    //ZkSyncMainnet
    const zksyncmain = useQuery(reporterQuery, {
      client: clientZksyncmain,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    })
    //ZkSyncTestnet
    const zksynctest = useQuery(reporterQuery, {
    client: clientZksynctest,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
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

    return () => {
      setGraphMainnetData({})
    }
  }, [mainnet.data, mainnet.loading, mainnet.error]) //eslint-disable-line

    //Linea
    useEffect(() => {
      if (!linea) return
      setGraphLineaData({
        data: linea.data,
        loading: linea.loading,
        error: linea.error,
      })
  
      return () => {
        setGraphLineaData({})
      }
    }, [linea.data, linea.loading, linea.error]) //eslint-disable-line
  //Linea Test
  useEffect(() => {
    if (!lineaTest) return
    setGraphLineaTestData({
      data: lineaTest.data,
      loading: lineaTest.loading,
      error: lineaTest.error,
    })

    return () => {
      setGraphLineaTestData({})
    }
  }, [lineaTest.data, lineaTest.loading, lineaTest.error]) //eslint-disable-line
    //Sepolia
    useEffect(() => {
      if (!sepolia) return
      setGraphSepoliaData({
        data: sepolia.data,
        loading: sepolia.loading,
        error: sepolia.error,
      })
  
      return () => {
        setGraphSepoliaData({})
      }
    }, [sepolia.data, sepolia.loading, sepolia.error]) //eslint-disable-line
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

  //Amoy
  useEffect(() => {
    if (!amoy.data) return
    setGraphAmoyData({
      data: amoy.data,
      loading: amoy.loading,
      error: amoy.error
    })
  
    return () => {
      setGraphAmoyData({})
    }
  }, [amoy.data, amoy.loading, amoy.error]) //eslint-disable-line
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
    setGraphOptMainData({
      data: optmain.data,
      loading: optmain.loading,
      error: optmain.error,
    })

    return () => {
      setGraphOptMainData({})
    }
  }, [optmain.data, optmain.loading, optmain.error]) //eslint-disable-line  
  //Optimism Test
  useEffect(() => {
    if (!opttest) return
    setGraphOptTestData({
      data: opttest.data,
      loading: opttest.loading,
      error: opttest.error,
    })

    return () => {
      setGraphOptTestData({})
    }
  }, [opttest.data, opttest.loading, opttest.error]) //eslint-disable-line  
  //Polygonzk
  useEffect(() => {
    if (!polygonzk) return
    setGraphPolygonzkData({
      data: polygonzk.data,
      loading: polygonzk.loading,
      error: polygonzk.error,
    })

    return () => {
      setGraphPolygonzkData({})
    }
  }, [polygonzk.data, polygonzk.loading, polygonzk.error]) //eslint-disable-line 
  
  //ZkSyncMain
   useEffect(() => {
    if (!zksyncmain) return
    setGraphZksyncMainData({
      data: zksyncmain.data,
      loading: zksyncmain.loading,
      error: zksyncmain.error,
    })

    return () => {
      setGraphZksyncTestData({})
    }
  }, [zksyncmain.data, zksyncmain.loading, zksyncmain.error]) //eslint-disable-line 

  //ZkSyncTest
  useEffect(() => {
    if (!zksynctest) return
    setGraphZksyncTestData({
      data: zksynctest.data,
      loading: zksynctest.loading,
      error: zksynctest.error,
    })

    return () => {
      setGraphZksyncTestData({})
    }
  }, [zksynctest.data, zksynctest.loading, zksynctest.error]) //eslint-disable-line 

  //For conglomerating data
  useEffect(() => {
    if (
      !graphMainnetData.data ||
      !graphLineaData.data ||
      !graphLineaTestData.data ||
      !graphSepoliaData.data ||
      !graphMaticData.data ||
      !graphAmoyData.data ||
      !graphArboneData.data ||
      !graphGnosismainData.data ||
      !graphOptMainData.data ||
      !graphOptTestData.data ||
      !graphPolygonzkData.data ||
      !graphZksyncMainData.data ||
      !graphZksyncTestData.data
    )
      return

    let eventsArray = []

graphMainnetData.data.newReportEntities.forEach((event) => {
    const updatedEvent = Object.assign({}, event, { chain: 'Ethereum Mainnet' });
    updatedEvent.txnLink = `https://etherscan.io/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });
  
graphSepoliaData.data.newReportEntities.forEach((event) => {
   const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
    updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });

graphMaticData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Polygon Mainnet' });
  updatedEvent.txnLink = `https://polygonscan.com/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphAmoyData.data.newReportEntities.forEach((event) => {
    const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
    updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });

graphArboneData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Arbitrum Mainnet' });
  updatedEvent.txnLink = `https://arbiscan.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});


graphGnosismainData.data.newReportEntities.forEach((event) => {
const updatedEvent = Object.assign({}, event, { chain: 'Gnosis Mainnet' });
updatedEvent.txnLink = `https://gnosisscan.io/tx/${event.txnHash}`;
eventsArray.push(updatedEvent);
});


graphOptMainData.data.newReportEntities.forEach((event) => {
const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
updatedEvent.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`;
eventsArray.push(updatedEvent);
});

graphOptMainData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
  updatedEvent.txnLink = `https://optimistic.etherscan./tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphOptTestData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Optimism Testnet' });
  updatedEvent.txnLink = `https://sepolia-optimism.etherscan..build/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphLineaData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Linea Mainnet' });
  updatedEvent.txnLink = `https://lineascan.build/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphLineaTestData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Linea Testnet' });
  updatedEvent.txnLink = `https://sepolia.lineascan.build/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphPolygonzkData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Polygon zkEVM Main' });
  updatedEvent.txnLink = `https://zkevm.polygonscan.com/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphZksyncMainData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'ZkSync Mainnet' });
  updatedEvent.txnLink = `https://explorer.zksync.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

graphZksyncTestData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'ZkSync Sepolia' });
  updatedEvent.txnLink = `https://sepolia.explorer.zksync.io/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

    let sorted = sortDataByProperty('_time', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [graphMainnetData, graphSepoliaData, graphMaticData, graphAmoyData, graphArboneData, graphGnosismainData, graphOptMainData, graphOptTestData, graphLineaData, graphLineaTestData, graphPolygonzkData, graphZksyncMainData, graphZksyncTestData]);

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

  return (
    <GraphContext.Provider value={GraphContextObj}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph