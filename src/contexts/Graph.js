import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { reporterQuery } from '../utils/queries'
import { sortDataByProperty, decodingMiddleware } from '../utils/helpers'
import { 
  clientMainnet, clientSepolia, clientMatic, clientAmoy, clientArbone, 
  clientGnosismain, clientOptMain, clientOptTest, clientLinea, clientLineaTest, 
  clientPolygonzk, clientZksyncMain, clientZksyncTest, clientScroll, clientBase
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
  scroll: 'https://scrollscan.com/tx/',
  base: 'https://basescan.org/tx/'
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
  scroll: 'Scroll Mainnet',
  base: 'Base Mainnet'
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
    base: { data: null, loading: true, error: null }
  });
  const [allGraphData, setAllGraphData] = useState([]);
  const [decodedData, setDecodedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterState, setFilterState] = useState({
    symbolFilters: [],
    chainFilters: [],
    reporterFilters: [],
    dateFilters: [],
    startDateSearchTerm: "",
    endDateSearchTerm: ""
  });

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
  useQueryWithTimeout(reporterQuery, clientBase, 'base');

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

  // Add filter function at context level
  const applyFilters = useCallback((data, filters) => {
    if (!data) return [];

    return data.filter(event => {
      const symbolMatch = filters.symbolFilters.length === 0 || filters.symbolFilters.includes(event.decodedValueName);
      const chainMatch = filters.chainFilters.length === 0 || filters.chainFilters.includes(event.chain);
      const reporterMatch = filters.reporterFilters.length === 0 || filters.reporterFilters.includes(event.decodedReporter);
      
      let startDate = new Date(filters.startDateSearchTerm);
      let endDate = new Date(filters.endDateSearchTerm);
      let eventDate = new Date(event.decodedTime.split(',')[0].trim().split('/').reverse().join('-'));

      const dateMatch = filters.startDateSearchTerm && filters.endDateSearchTerm ? 
        (eventDate >= startDate && eventDate <= endDate) : 
        filters.dateFilters.length === 0 || filters.dateFilters.some(filterDate => event.decodedTime.startsWith(filterDate));
  
      return symbolMatch && chainMatch && reporterMatch && dateMatch;
    });
  }, []);

  // Apply filters whenever data or filter state changes
  useEffect(() => {
    if (!decodedData.length) return;
    const filtered = applyFilters(decodedData, filterState);
    setFilteredData(filtered);
  }, [decodedData, filterState, applyFilters]);

  return (
    <GraphContext.Provider value={{ allGraphData, decodedData, networkData, filteredData, filterState }}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph