import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { reporterQuery, autopayQuery } from '../utils/queries'
import { decodingMiddleware, sortDataByProperty } from '../utils/helpers'

export const GraphContext = createContext()

//ApolloClients
const clientMainnet = new ApolloClient({
  uri: 'https://gateway-arbitrum.network.thegraph.com/api/ad08435a6d6c0933c9e272dbdfa21322/subgraphs/id/5vJKyvzkSDv6kc5vCbyohvXq1KgCczsSVr58jUaPih6S',
  cache: new InMemoryCache(),
})
/*const clientMainnet2 = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellororaclemainhgraph/version/latest',
  cache: new InMemoryCache(),
})*/ 
const clientLinea = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-main/v0.0.1',
  cache: new InMemoryCache(), 
})
const clientSepolia = new ApolloClient({
  uri: 'https://gateway-arbitrum.network.thegraph.com/api/ad08435a6d6c0933c9e272dbdfa21322/subgraphs/id/EVBJPDb3Cv5CQiWQetL9voCs95YP5tgozPyxuXq4iZhN',
  cache: new InMemoryCache(),
})
/*const clientSepolia2 = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-flex-sepolia-subgraph2/v0.0.2',
  cache: new InMemoryCache(),
})*/
const clientMatic = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellorflexoraclematichgraph',
  cache: new InMemoryCache(),
})
const clientMatic2 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-flex-matic-graph2',
  cache: new InMemoryCache(),
})
const clientAmoy = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-amoy-test-subgr/version/latest',
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
const clientOptmain2 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/raynharr/tellor-flex-optmain-graph2',
  cache: new InMemoryCache(),
})
const clientPolygonzk = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/33329/tellor-oracle-polygonzk-main/v0.0.1',
  cache: new InMemoryCache(),
})

const Graph = ({ children }) => {
  //Component State
  const [graphMainnetData, setGraphMainnetData] = useState({})
  const [graphSepoliaData, setGraphSepoliaData] = useState({})
  const [graphMaticData, setGraphMaticData] = useState({})
  const [graphAmoyData, setGraphAmoyData] = useState({})
  const [graphArboneData, setGraphArboneData] = useState({})
  const [graphArbtestData, setGraphArbtestData] = useState({})
  const [graphGnosismainData, setGraphGnosismainData] = useState({})
  const [graphOptmainData, setGraphOptmainData] = useState({})
  const [graphLineaData, setGraphLineaData] = useState({})
  const [graphPolygonzkData, setGraphPolygonzkData] = useState({})
  const [allGraphData, setAllGraphData] = useState(null)
  const [decodedData, setDecodedData] = useState(null)

  //Graph Querying every 5 seconds
  //Mainnet
  const mainnet = useQuery(reporterQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  /*const mainnet2 = useQuery(reporterQuery, {
    client: clientMainnet2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  }))*/
  const mainPay = useQuery(autopayQuery, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
   //Linea
   const linea = useQuery(reporterQuery, {
    client: clientLinea,
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
  /*const sepolia2 = useQuery(reporterQuery, {
    client: clientSepolia2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })*/
  //Matic
  const matic = useQuery(reporterQuery, {
    client: clientMatic,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Matic
  const matic2 = useQuery(reporterQuery, {
    client: clientMatic2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  //Amoy
  const amoy = useQuery(reporterQuery, {
    client: clientAmoy,
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
   //optimism(mainnet)
   const optmain2 = useQuery(reporterQuery, {
    client: clientOptmain2,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
     //polygonzkevm
     const polygonzk = useQuery(reporterQuery, {
      client: clientPolygonzk,
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
    if (!matic && !matic2.data) return
    const combinedData = {
      ...matic.data,
      ...matic2.data,
      newReportEntities: [
        ...(matic.data?.newReportEntities || []),
        ...(matic2.data?.newReportEntities || [])
      ]
    }
    setGraphMaticData({
      data: combinedData,
      loading: matic.loading || matic2.loading,
      error: matic.error || matic2.error,
    })

    return () => {
      setGraphMaticData({})
    }
  }, [matic.data, matic.loading, matic.error, matic2.data, matic2.loading, matic2.error]) //eslint-disable-line
  //Amoy
  useEffect(() => {
    if (!amoy.data && !mumbai2.data) return
    const combinedData = {
      ...amoy.data,
      ...mumbai2.data,
      newReportEntities: [
        ...(amoy.data?.newReportEntities || []),
        ...(mumbai2.data?.newReportEntities || [])
      ]
    }
    setGraphAmoyData({
      data: combinedData,
      loading: amoy.loading || mumbai2.loading,
      error: amoy.error || mumbai2.error,
    })
  
    return () => {
      setGraphAmoyData({})
    }
  }, [amoy.data, amoy.loading, amoy.error, mumbai2.data, mumbai2.loading, mumbai2.error]) //eslint-disable-line
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
    if (!optmain.data && !optmain2.data) return
    const combinedData = {
      ...optmain.data,
      ...optmain2.data,
      newReportEntities: [
        ...(optmain.data?.newReportEntities || []),
        ...(optmain2.data?.newReportEntities || [])
      ]
    }
    setGraphOptmainData({
      data: combinedData,
      loading: optmain.loading || optmain2.loading,
      error: optmain.error || optmain2.error,
    })
  
    return () => {
      setGraphOptmainData({})
    }
  }, [optmain.data, optmain.loading, optmain.error, optmain2.data, optmain2.loading, optmain2.error]) //eslint-disable-line
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

  //For conglomerating data
  useEffect(() => {
    if (
      !graphMainnetData.data ||
      !graphLineaData.data ||
      !graphSepoliaData.data ||
      !graphMaticData.data ||
      !graphAmoyData.data ||
      !graphArboneData.data ||
      !graphArbtestData.data ||
      !graphGnosismainData.data ||
      !graphOptmainData.data ||
      !graphPolygonzkData.data
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

graphLineaData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Linea Mainnet' });
  updatedEvent.txnLink = `https://lineascan.build/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});

if (graphSepoliaData.data && graphSepoliaData.data.newReportEntities) {
  graphSepoliaData.data.newReportEntities.forEach((event) => {
   const updatedEvent = Object.assign({}, event, { chain: 'Sepolia Testnet' });
    updatedEvent.txnLink = `https://sepolia.etherscan.io/tx/${event.txnHash}`;
    eventsArray.push(updatedEvent);
  });
}

if (graphMaticData.data && graphMaticData.data.newReportEntities) {
graphMaticData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Polygon Mainnet' });
  updatedEvent.txnLink = `https://polygonscan.com/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});
}

if (graphAmoyData.data && graphAmoyData.data.newReportEntities) {
  graphAmoyData.data.newReportEntities.forEach((event) => {
    const updatedEvent = Object.assign({}, event, { chain: 'Amoy Testnet' });
    updatedEvent.txnLink = `https://amoy.polygonscan.com/tx/${event.txnHash}`;
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

if (graphOptmainData.data && graphOptmainData.data.newReportEntities) {
graphOptmainData.data.newReportEntities.forEach((event) => {
const updatedEvent = Object.assign({}, event, { chain: 'Optimism Mainnet' });
updatedEvent.txnLink = `https://optimistic.etherscan.io/tx/${event.txnHash}`;
eventsArray.push(updatedEvent);
});

graphPolygonzkData.data.newReportEntities.forEach((event) => {
  const updatedEvent = Object.assign({}, event, { chain: 'Polygon zkEVM Mainnet' });
  updatedEvent.txnLink = `https://zkevm.polygonscan.com/tx/${event.txnHash}`;
  eventsArray.push(updatedEvent);
});
}
    let sorted = sortDataByProperty('_time', eventsArray)
    setAllGraphData(sorted)

    return () => {
      setAllGraphData(null)
    }
  }, [graphMainnetData, graphLineaData, graphSepoliaData, graphMaticData, graphAmoyData, graphArboneData, graphArbtestData, graphGnosismainData, graphOptmainData, graphPolygonzkData])

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