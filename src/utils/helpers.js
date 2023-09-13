import minABI from './minimumABI.json'
import Web3 from 'web3'
import { queryDataParsers } from './queryDataParsers'
//Globals
const web3 = new Web3(window.ethereum)

const BN = require('bn.js');

const tellorAddressMainnet = '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0'
const tellorAddressPolygon = '0xE3322702BEdaaEd36CdDAb233360B939775ae5f1'
const tellorAddressMumbai = '0xce4e32fe9d894f8185271aa990d2db425df3e6be'
const tellorAddressGoerli = '0xB3B662644F8d3138df63D2F43068ea621e2981f9'
const tellorAddressArbone = '0xd58D345Fd9c82262E087d2D0607624B410D88242'

const getDate = (timestamp) => {
  const months = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  }
  const date = new Date(timestamp * 1000).toString()
  const dateArr = date.split(' ')
  const finalDate = `${dateArr[2]}/${months[dateArr[1]]}/${dateArr[3]}, ${
    dateArr[4]
  }`
  return finalDate
}

const hex2a = (hexx) => {
  let hex = hexx.toString() //force conversion
  let str = ''
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))

  return str.substring(1)
}

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export const getAssetBalances = async (web3, address, chainId) => {
  //Instantiating Contracts
  const trbContractEthereum = new web3.eth.Contract(
    minABI,
    tellorAddressMainnet
  )
  const trbContractPolygon = new web3.eth.Contract(minABI, tellorAddressPolygon)
  const trbContractMumbai = new web3.eth.Contract(minABI, tellorAddressMumbai)
  const trbContractGoerli = new web3.eth.Contract(minABI, tellorAddressGoerli)
  const trbContractArbone = new web3.eth.Contract(minABI, tellorAddressArbone)
  //Function Globals
  let chainMainTokenBalance
  let trbBalance

  switch (chainId) {
    case 1:
      //Main Chain Balance - ETHEREUM MAINNET
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractEthereum.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 4:
      //Main Chain Balance - RINKEBY
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractEthereum.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 5:
      //Main Chain Balance - GOERLI
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractGoerli.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
      case 42161:
        //Main Chain Balance - ARBITRUM ONE
        chainMainTokenBalance = web3.utils.fromWei(
          await web3.eth.getBalance(address)
        )
        trbBalance = await trbContractArbone.methods
          .balanceOf(address)
          .call()
          .then((res) => web3.utils.fromWei(res))
        //Add more assets here if needed
        return {
          main: Math.round(chainMainTokenBalance * 100) / 100,
          trb: Math.round(trbBalance * 100) / 100,
        }
        case 137:
      //Main Chain Balance - MATIC/POLYGON MAINNET
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractPolygon.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 80001:
      //Main Chain Balance - MUMBAI
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractMumbai.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    default:
      return null
  }
}

export const sortDataByProperty = (prop, arr) => {
  arr.sort(function (a, b) {
    if (a[prop] < b[prop]) {
      return 1
    } else if (a[prop] > b[prop]) {
      return -1
    } else {
      return 0
    }
  })
  return arr
}

export const decodingAutopayMiddleware = (autopayEvents) => {
  //console.log(autopayEvents)
  let decoded = autopayEvents.map((event) => {
    let queryDataPartial
    let queryData
    let finalQueryData
    if (event.divaPayQuery || event.divaPayAdaptorQuery) {
      if (event.referenceAsset !== undefined) {
        event.decodedValue = event.referenceAsset;
      } else {
        event.decodedValue = '0';
        console.error("referenceAsset is missing for event:", event);
      }
    }
  
    event.interval = event._interval ? `${(event._interval / 60 / 60)} hour(s)  ` : 'One-Time Tip'
    //console.log(event._interval)
    event.tip = event._reward ? web3.utils.fromWei(event._reward.toString() ?? '0') + event.tippingToken : web3.utils.fromWei(event._amount?.toString()  ?? '0').slice(0,6) + ' TRB' 
    event.tips = event.tip
    console.log(event.dataProvider)
    event.balance = event._balance ? web3.utils.fromWei(event._balance.toString() ?? '0').slice(0,7) + ' TRB' : '-'
    event.multipliedValue = event.amount ? (Number(event.amount).toFixed(7))+ (event.settlementFee * event.collateralBalanceGross) +  event.tippingToken: '0';    //console.log(event.event.tippingToken);
    event.startTime = getDate(event._startTime)
    event.window = event._window
    event.symbols = event._queryData
    event.symbol = ''
    event.floor = event.floor
    event.expiryTime = getDate(event.expiryTime)
    if (event.collateralToken){
      event.symbol = event.collateralToken.symbol
      console.log(event.symbol)
    }
    if (event.collateralBalanceGross) {
      console.log(event);
    }    
    if (event._queryData && event._queryData.length <= 104) {
      try {queryData = JSON.parse(hex2a(event._queryData))
      event.queryDataObj = queryData
      queryDataParsers[queryData?.type || queryData?.Type || 'Default'](event)
      } catch {
        event.queryDataObj='0x'
      }
    } 
    if (event._queryData && event._queryData.length > 104) {
      queryDataPartial = web3.eth.abi.decodeParameters(
        ['string', 'bytes'],
        event._queryData
        
      )
      switch (queryDataPartial[0]) {
        
        case 'LegacyRequest':
          event.decodedValue = parseInt(Number(queryDataPartial[1]), 10)
          queryDataParsers[queryDataPartial[0] || 'Default'](event)
          break
        case 'SpotPrice':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string'],
            queryDataPartial[1]
          )
          event.decodedValue = `${finalQueryData[0].toUpperCase()}/${finalQueryData[1].toUpperCase()}`
          break
        case 'MimicryNFTMarketIndex':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string'],
            queryDataPartial[1]
          )
          event.decodedValue = `MIMICRY_NFTINDX ${finalQueryData[0].toUpperCase()}/${finalQueryData[1].toUpperCase()}`
          break
        case 'MimicryMacroMarketMashup':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string', 'tuple(string, address)[]','(string, string, address)[]'],
            queryDataPartial[1]
          )
          event.decodedValue = `MIMICRY_NFTMASH (${finalQueryData[3][0][1].toUpperCase()})`
          break
        case 'MimicryCollectionStat':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string'],
            queryDataPartial[1]
          )
          event.decodedValue = `Mimicry NFT STAT ${finalQueryData[0].toUpperCase()}/${finalQueryData[1].toUpperCase()}`
          break
        case 'DivaPool':
            finalQueryData = queryDataPartial[1].data.pools[0]
            event.queryDataObj = finalQueryData
            event.decodedValue = finalQueryData.proposedFinalReferenceValue
            event.pool = {
              id: finalQueryData.pool.id.toUpperCase()
            }
            break
        case 'DivaFeeRecipients':
          finalQueryData = queryDataPartial[1].data.feeRecipients[0]
          event.queryDataObj = finalQueryData
          event.decodedValue = finalQueryData.collateralTokens
          event.feeRecipient = {
            id: finalQueryData.feeRecipient.id.toUpperCase()
          }
          break
        case 'EVMCall':
            finalQueryData = web3.eth.abi.decodeParameters(
              ['uint'],
              queryDataPartial[1]
            )
            event.decodedValue = `EVMCall ${finalQueryData[0]}`
            return event
        /*case 'GasPriceOracle':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string'],
            queryDataPartial[1]
          )
          event.queryDataObj = finalQueryData
          queryDataParsers['SpotPriceProper' || 'Default'](event)
          break*/
        case 'CurrencyExchangeRate':
            finalQueryData = web3.eth.abi.decodeParameters(
              ['string', 'string'],
              queryDataPartial[1]
            )
            event.decodedValue = `${finalQueryData[0].toUpperCase()}/${finalQueryData[1].toUpperCase()}`
            break
        //These will not be shown: https://github.com/tellor-io/dataSpecs/blob/main/types/NumericApiResponse.md
        default:
          event.decodedValue = 'NumericApiResponse'
          return event
      }
    }
    return event
  })



  let filtered = [];
  decoded.map((event) => {
    if(event.decodedValue === 'NumericApiResponse'){
      return;
    } else {
      filtered.push(event);
    }
  })
  //console.log('filtered', filtered);
  return filtered;
}

export const getCollateralTokenSymbol = (token) => {
  return token.collateralToken.symbol;
}

export const decodingMiddleware = (reportEvents) => {
  let decoded = reportEvents.map((event) => {
    let queryData
    let queryDataPartial
    let finalQueryData
    let temp
    event.id = event.id + event._nonce + event.chain.split(' ')[0]
    event.decodedTime = getDate(event._time)
    event.decodedReporter = web3.utils.toChecksumAddress(event._reporter)
    event.queryId = parseInt(Number(event._queryId), 10)

    
    
    if (event._queryData && event._queryData.length <= 104) {
      try {queryData = JSON.parse(hex2a(event._queryData))
      event.queryDataObj = queryData
      queryDataParsers[queryData?.type || queryData?.Type || 'Default'](event)
      } catch {
        event.queryDataObj='0x'
      }
    } else if (event._queryData && event._queryData.length > 104) {
      queryDataPartial = web3.eth.abi.decodeParameters(
        ['string', 'bytes'],
        event._queryData
      )
      switch (queryDataPartial[0]) {
        case 'LegacyRequest':
          event.queryId = parseInt(Number(queryDataPartial[1]), 10)
          queryDataParsers[queryDataPartial[0] || 'Default'](event)
          break
        case 'SpotPrice':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string', 'string'],
            queryDataPartial[1]
          )
          event.queryDataObj = finalQueryData
          queryDataParsers['SpotPriceProper' || 'Default'](event)
          break
        case 'DivaPay':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string'],
            queryDataPartial[1]
          )
          event.decodedValue = `DivaPay ${finalQueryData[0]}`
          break
      case 'MimicryNFTMarketIndex':
        finalQueryData = web3.eth.abi.decodeParameters(
          ['string', 'string'],
          queryDataPartial[1]
        )
        event.queryDataObj = finalQueryData
        queryDataParsers['MimicryNFTMarketIndex' || 'Default'](event)
          break
      case 'MimicryMacroMarketMashup':
        finalQueryData = web3.eth.abi.decodeParameters(
          ['string', 'string', 'tuple(string, address)[]','tuple(string, string, address)[]'],
             queryDataPartial[1]
          )
        event.queryDataObj = finalQueryData
        queryDataParsers['MimicryMacroMarketMashup' || 'Default'](event)
              break
      /*case 'DivaPool':
        finalQueryData = web3.eth.abi.decodeParameters(
          ['string', 'string', 'tuple(string, address)[]','tuple(string, string, address)[]'],
            queryDataPartial[1]
          )
        event.queryDataObj = finalQueryData
        queryDataParsers['DivaPool' || 'Default'](event)
              break*/
      case 'EVMCall':
        finalQueryData = web3.eth.abi.decodeParameters(
          ['uint256', 'address', 'bytes'],
             queryDataPartial[1]
          )
          event.queryDataObj = finalQueryData
          queryDataParsers['EVMCall' || 'Default'](event)
              break
      /*case 'GasPriceOracle':
        finalQueryData = web3.eth.abi.decodeParameters(
          ['string', 'string'],
          queryDataPartial[1]
        )
        event.decodedValue = `${finalQueryData[0].toUpperCase()}/${finalQueryData[1].toUpperCase()}`
            break*/ 
        case 'CurrencyExchangeRate':
            finalQueryData = web3.eth.abi.decodeParameters(
              ['string', 'string'],
              queryDataPartial[1]
            )
            event.queryDataObj = finalQueryData
            queryDataParsers['EUR/USD' || 'Default'](event)
            break
        case 'TellorRNG':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['uint'],
            queryDataPartial[1]
          )
          temp = web3.eth.abi.decodeParameters(
            ['uint256'],
            event._value
          )
          event.feedType = 'TellorRNG'
          event.decodedValueName = `TellorRNG`
          let t1  = `[${temp[0]}]`
          event.decodedValue = t1.slice(1,7) + "..."
          return event
        case 'Snapshot':
          finalQueryData = web3.eth.abi.decodeParameters(
            ['string'],
            queryDataPartial[1]
          )
          event.snapshotProposalId = parseInt(finalQueryData[0])
          temp = web3.eth.abi.decodeParameters(
            ['bool'],
            event._value
          )
          event.feedType = 'Snapshot'
          event.decodedValueName = `Snap: ${event.snapshotProposalId}`
          event.decodedValue = `[${temp[0]}]`
          return event
        // queryDataParsers['Snapshot' || 'Default'](event)
        // break
        default:
          queryDataParsers['Default'](event)
          return event
      }
    }

    if (event.queryId == "STEH/BTC") {

    }
    return event
  })
  // console.log(decoded)
  return decoded
}
 