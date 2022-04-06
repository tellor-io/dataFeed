import minABI from './minimumABI.json'
import Web3 from 'web3'
import { queryDataParsers } from './queryDataParsers'
//Globals
const web3 = new Web3()
const tellorAddressMainnet = '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0'
const tellorAddressPolygon = '0xE3322702BEdaaEd36CdDAb233360B939775ae5f1'
const tellorAddressMumbai = '0x45cAF1aae42BA5565EC92362896cc8e0d55a2126'
const tellorAddressGoerli = '0x002E861910D7f87BAa832A22Ac436F25FB66FA24'

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

export const decodingMiddleware = (reportEvents) => {
  let decoded = reportEvents.map((event) => {
    let queryData
    let queryDataPartial
    let finalQueryData
    event.id = event.id + event._nonce + event.chain.split(' ')[0]
    event.decodedTime = getDate(event._time)
    event.decodedReporter = web3.utils.toChecksumAddress(event._reporter)
    event.queryId = parseInt(Number(event._queryId), 10)

    if (event._queryData && event._queryData.length <= 104) {
      queryData = JSON.parse(hex2a(event._queryData))
      event.queryDataObj = queryData
      queryDataParsers[queryData?.type || queryData?.Type || 'Default'](event)
    } else if (event._queryData && event._queryData.length > 104) {
      queryDataPartial = web3.eth.abi.decodeParameters(
        ['string', 'bytes'],
        event._queryData
      )
      if (queryDataPartial[0] === 'LegacyRequest') {
        event.queryId = parseInt(Number(queryDataPartial[1]), 10)
        queryDataParsers[queryDataPartial[0] || 'Default'](event)
      } else if (queryDataPartial[0] === 'SpotPrice') {
        finalQueryData = queryDataPartial = web3.eth.abi.decodeParameters(
          ['string', 'string'],
          queryDataPartial[1]
        )
        event.queryDataObj = finalQueryData
        queryDataParsers['SpotPriceProper' || 'Default'](event)
      }
    }
    return event
  })
  // console.log(decoded)
  return decoded
}
