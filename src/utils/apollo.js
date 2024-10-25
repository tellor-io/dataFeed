import { ApolloClient, InMemoryCache } from '@apollo/client';

const createClient = (uri) => new ApolloClient({
  uri,
  cache: new InMemoryCache()
});

export const clientMainnet = createClient('https://api.studio.thegraph.com/query/33329/tellororaclemainhgraph/version/latest');
export const clientSepolia = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-sepolia-graph/version/latest');
export const clientMatic = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-matic-graph2/version/latest');
export const clientAmoy = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-amoy-test-subgr/version/latest');
export const clientArbone = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-arbitrummain-graph/version/latest');
export const clientGnosismain = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-matic-graph2/version/latest');
export const clientOptMain = createClient('https://api.studio.thegraph.com/query/33329/tellor-flex-optmain-graph2/version/latest');
export const clientOptTest = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-optimism-testnet/version/latest');
export const clientLinea = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-main/v0.0.1');
export const clientLineaTest = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-linea-tesnet/version/latest');
export const clientPolygonzk = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-polygonzk-main/v0.0.1');
export const clientZksyncMain = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-zksync-main-subg/version/latest');
export const clientZksyncTest = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-zksync-test-subg/version/latest');
export const clientScroll = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-scroll/version/latest');
export const clientBase = createClient('https://api.studio.thegraph.com/query/33329/tellor-oracle-base/version/latest');
