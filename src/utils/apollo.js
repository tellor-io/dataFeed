import { ApolloClient, InMemoryCache } from '@apollo/client';

const createClient = (uri, headers = {}) => {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
    headers
  });
};

export const clientMainnet = createClient('https://gateway.thegraph.com/api/subgraphs/id/5vJKyvzkSDv6kc5vCbyohvXq1KgCczsSVr58jUaPih6S', {
  'Authorization': 'Bearer 95e299ffff2fab2572025a89a1243cbc'
});
export const clientSepolia = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-sepolia-graph/version/latest');
export const clientMatic = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-matic-graph2/version/latest');
export const clientAmoy = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-amoy-test-subgr/version/latest');
export const clientArbone = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-arbitrummain-graph/version/latest');
export const clientGnosismain = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-gnosis-main/version/latest');
export const clientOptMain = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-optmain-graph2/version/latest');
export const clientLinea = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-main/v0.0.1');
export const clientPolygonzk = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-polygonzk-main/v0.0.1');
export const clientZksyncMain = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-zksync-main-subg/version/latest');
export const clientScroll = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-scroll/version/latest');
export const clientBase = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-base/version/latest');
