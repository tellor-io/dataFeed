import { psrLookup } from './psrLookup'
import Web3 from 'web3'

const eighteenDecimals = 1000000000000000000

const web3 = new Web3(window.ethereum)

export const queryDataParsers = {
  LegacyRequest: (event) => {
    switch (event.queryId) {
      case 1:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event._value / 1000000)
        return event
      case 2:
        event.decodedValueName = psrLookup[event.queryId].name
        try {event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event._value / 1000000)
      } catch {
        event.decodedValue='disputed'
      }
        return event
      case 3:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue =
          event._value === '0x'
            ? '0'
            : new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
              }).format(event._value / 1000000)
        return event
      case 10:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue =
          event._value.toString().length > 17
            ? new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
              }).format(event._value / eighteenDecimals)
            : new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
              }).format(event._value / 1000000)
        return event
      case 41:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue =
          event._value.toString().length > 18
            ? (event._value / eighteenDecimals).toString()
            : event._value.toString().length > 6
            ? '*' + (event._value / 1000000).toString()
            : '*' + event._value.toString()
        return event
      case 50:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event._value / 1000000)
        return event
      case 59:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'JPY',
        }).format(event._value / 1000000)
        return event
      default:
        event.decodedValueName = 'New Legacy Type'
        event.decodedValue = '0'
        return event
    }
  },
  MimicryNFTMarketIndex: (event) => {
    event.decodedValueName = `MIMICRY NFTMKTINDX ${event.queryDataObj[0].toUpperCase()}`

    const valueInWei = parseInt(event._value, 16) / 10 ** 18;
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(valueInWei);
    event.decodedValue = formattedValue;
    return event;
  },
  
  SpotPrice: (event) => {
    switch (event.queryId) {
      case 5:
        event.decodedValueName = `${event.queryDataObj.asset}/${event.queryDataObj.currency}`
        event.decodedValue = parseInt(Number(event._value), 10)
        return event
      default:
        event.decodedValueName = 'New SpotPrice Type'
        event.decodedValue = '0'
        return event
    }
  },
  SpotPriceProper: (event) => {
    switch (event.queryDataObj[0]) {
      case 'ohm':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = `${
          parseInt(Number(event._value), 10) / eighteenDecimals
        }`
        return event
      case 'dai':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = `$${(
          parseInt(Number(event._value), 10) / eighteenDecimals
        ).toString()}`
        return event
      case 'ric':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'bct':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'mkr':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(event._value) / eighteenDecimals)
        return event
      case 'usdc':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'vsq':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'idle':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'sushi':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'matic':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
        return event
      case 'eur':
          event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
          event.decodedValue = new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'USD',
          }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
          return event
      case 'steth':
            event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
            event.decodedValue = new Intl.NumberFormat('en-EN', {
              style: 'currency',
              currency: 'BTC',
              minimumFractionDigits: 6,
              maximumFractionDigits: 6
            }).format(parseInt(Number(event._value), 10) / eighteenDecimals)
            return event
      case 'wsteth':
        if (event.queryDataObj[1] === 'eth') {
            event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`
            const value = parseInt(Number(event._value), 10) / eighteenDecimals
            const options = {
              style: 'currency',
              currency: 'ETH',
            }
              options.minimumFractionDigits = 6
              options.maximumFractionDigits = 6
              event.decodedValue = new Intl.NumberFormat('en-EN', options).format(value)

            }
        if (event.queryDataObj[1] === 'usd') {
            let queryData = web3.eth.abi.decodeParameters(['string', 'string'], web3.eth.abi.decodeParameters(['string', 'bytes'], event._queryData)[1])
            event.decodedValueName = `${queryData[0].toUpperCase()}/${queryData[1].toUpperCase()}`
            event.decodedValue = new Intl.NumberFormat('en-EN', {
              style: 'currency',
              currency: queryData[1].toUpperCase(),
        }).format(Number(event._value) / eighteenDecimals)
            }
            return event

          
      default:
        let queryData = web3.eth.abi.decodeParameters(['string', 'string'], web3.eth.abi.decodeParameters(['string', 'bytes'], event._queryData)[1])
        event.decodedValueName = `${queryData[0].toUpperCase()}/${queryData[1].toUpperCase()}`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: queryData[1].toUpperCase(),
        }).format(Number(event._value) / eighteenDecimals)
        return event
    }
  },
  // Snapshot: (event) => {
  //   switch (event) {
  //     case '1':
  //       event.decodedValueName = `SPID: ${event.snapshotProposalId}`
  //       event.decodedValue = `[${event.tempValues[0]}, ${event.tempValues[1]}]`
  //       return event
  //     default:
  //       event.decodedValueName = 'New Snapshot Type'
  //       event.decodedValue = '0'
  //       return event
  //   }
  // },*/
  Default: (event) => {
    switch (event._value.length) {
      case 66:
        event.decodedValueName = web3.eth.abi.decodeParameters(['string', 'bytes'], event._queryData)[0]
        event.decodedValue =  parseInt(event._value)/eighteenDecimals
        return event
      default:
        event.decodedValueName = web3.eth.abi.decodeParameters(['string', 'bytes'], event._queryData)[0]
        event.decodedValue = '0'
        return event
    }
  },
}
