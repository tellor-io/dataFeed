import React, { createContext, useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { reporterQuery } from '../utils/queries'
import { sortDataByProperty, decodingMiddleware } from '../utils/helpers'
import { 
  clientMainnet, clientSepolia, clientMatic, clientAmoy, clientArbone, 
  clientGnosismain, clientOptMain, clientOptTest, clientLinea, clientLineaTest, 
  clientPolygonzk, clientZksyncMain, clientZksyncTest, clientScroll 
} from '../utils/apollo'

export const GraphContext = createContext()

const explorerUrls = {
  mainnet: 'https://etherscan.io/tx/',
  sepolia: 'https://sepolia.etherscan.io/tx/',
  matic: 'https://polygonscan.com/tx/',
  amoy: 'https://amoy.polygonscan.com/tx/',
  arbone: 'https://arbiscan.io/tx/',
  gnosismain: 'https://gnosisscan.io/tx/',
  optMain: 'https://optimistic.etherscan.io/tx/',
  optTest: 'https://sepolia-optimism.etherscan.io/tx/',
  linea: 'https://lineascan.build/tx/',
  lineaTest: 'https://sepolia.lineascan.build/tx/',
  polygonzk: 'https://zkevm.polygonscan.com/tx/',
  zksyncMain: 'https://explorer.zksync.io/tx/',
  zksyncTest: 'https://sepolia.explorer.zksync.io/tx/',
  scroll: 'https://scrollscan.com/tx/'
};

const networkNames = {
  mainnet: 'Ethereum Mainnet',
  sepolia: 'Sepolia Testnet',
  matic: 'Polygon Mainnet',
  amoy: 'Amoy Testnet',
  arbone: 'Arbitrum Mainnet',
  gnosismain: 'Gnosis Mainnet',
  optMain: 'Optimism Mainnet',
  optTest: 'Optimism Testnet',
  linea: 'Linea Mainnet',
  lineaTest: 'Linea Testnet',
  polygonzk: 'Polygon zkEVM Main',
  zksyncMain: 'ZkSync Mainnet',
  zksyncTest: 'ZkSync Sepolia',
  scroll: 'Scroll Mainnet'
};

const Graph = ({ children }) => {
  const [networkData, setNetworkData] = useState({
    mainnet: { data: null, loading: true, error: null },
    sepolia: { data: null, loading: true, error: null },
    matic: { data: null, loading: true, error: null },
    amoy: { data: null, loading: true, error: null },
    arbone: { data: null, loading: true, error: null },
    gnosismain: { data: null, loading: true, error: null },
    optMain: { data: null, loading: true, error: null },
    optTest: { data: null, loading: true, error: null },
    linea: { data: null, loading: true, error: null },
    lineaTest: { data: null, loading: true, error: null },
    polygonzk: { data: null, loading: true, error: null },
    zksyncMain: { data: null, loading: true, error: null },
    zksyncTest: { data: null, loading: true, error: null },
    scroll: { data: null, loading: true, error: null },
  });
  const [allGraphData, setAllGraphData] = useState([]);
  const [decodedData, setDecodedData] = useState([]);

  const useQueryWithTimeout = (query, client, networkName, timeout = 10000) => {
    const { data, loading, error } = useQuery(query, {
      client,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        if (loading) {
          setNetworkData(prev => ({
            ...prev,
            [networkName]: { ...prev[networkName], loading: false, error: new Error('Timeout') }
          }));
        }
      }, timeout);

      return () => clearTimeout(timer);
    }, [loading, networkName, timeout]); // Added timeout to the dependency array

    useEffect(() => {
      setNetworkData(prev => ({
        ...prev,
        [networkName]: { data, loading, error }
      }));
    }, [data, loading, error, networkName]);

    return { data, loading, error };
  };

  // Instead, directly call useQueryWithTimeout for each network
  useQueryWithTimeout(reporterQuery, clientMainnet, 'mainnet');
  useQueryWithTimeout(reporterQuery, clientSepolia, 'sepolia');
  useQueryWithTimeout(reporterQuery, clientMatic, 'matic');
  useQueryWithTimeout(reporterQuery, clientAmoy, 'amoy');
  useQueryWithTimeout(reporterQuery, clientArbone, 'arbone');
  useQueryWithTimeout(reporterQuery, clientGnosismain, 'gnosismain');
  useQueryWithTimeout(reporterQuery, clientOptMain, 'optMain');
  useQueryWithTimeout(reporterQuery, clientOptTest, 'optTest');
  useQueryWithTimeout(reporterQuery, clientLinea, 'linea');
  useQueryWithTimeout(reporterQuery, clientLineaTest, 'lineaTest');
  useQueryWithTimeout(reporterQuery, clientPolygonzk, 'polygonzk');
  useQueryWithTimeout(reporterQuery, clientZksyncMain, 'zksyncMain');
  useQueryWithTimeout(reporterQuery, clientZksyncTest, 'zksyncTest');
  useQueryWithTimeout(reporterQuery, clientScroll, 'scroll');

  useEffect(() => {
    const processNetworkData = (networkName, data) => {
      if (!data || !data.newReportEntities) return [];
      
      return data.newReportEntities.map(event => ({
        ...event,
        chain: networkNames[networkName],
        txnLink: `${explorerUrls[networkName]}${event.txnHash}`,
        uniqueId: `${event.txnHash}-${networkName}`
      }));
    };

    const newData = Object.entries(networkData).flatMap(([networkName, { data }]) => 
      processNetworkData(networkName, data)
    );

    setAllGraphData(prev => {
      const combined = [...prev, ...newData];
      const uniqueData = Array.from(new Map(combined.map(item => [item.uniqueId, item])).values());
      return sortDataByProperty('_time', uniqueData);
    });

  }, [networkData]);

  useEffect(() => {
    if (allGraphData.length > 0) {
      const decoded = decodingMiddleware(allGraphData);
      setDecodedData(decoded);
    }
  }, [allGraphData]);

  return (
    <GraphContext.Provider value={{ allGraphData, decodedData, networkData }}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph