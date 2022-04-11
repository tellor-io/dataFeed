import { psrLookup } from './psrLookup'

const eighteenDecimals = 1000000000000000000

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
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event._value / 1000000)
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
        event.decodedValue = `$${
          parseInt(Number(event._value), 10) / eighteenDecimals
        }`
        return event
      case 'dai':
        event.decodedValueName = `${event.queryDataObj[0].toUpperCase()}/${event.queryDataObj[1].toUpperCase()}`

        event.decodedValue = (
          parseInt(Number(event._value), 10) / eighteenDecimals
        ).toString()
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
      default:
        event.decodedValueName = 'New SpotPriceProper Type'
        event.decodedValue = '0'
        return event
    }
  },
  Snapshot: (event) => {
    switch (event.snapshotProposalId) {
      case '1':
        event.decodedValueName = `SPID: ${event.snapshotProposalId}`
        event.decodedValue = `[${event.tempValues[0]}, ${event.tempValues[1]}]`
        return event
      default:
        event.decodedValueName = 'New Snapshot Type'
        event.decodedValue = '0'
        return event
    }
  },
  Default: (event) => {
    switch (event.queryId) {
      case 8:
        event.decodedValueName =
          event._queryData.charAt(0).toUpperCase() + event._queryData.slice(1)
        event.decodedValue =
          event._queryData.charAt(0).toUpperCase() + event._queryData.slice(1)
        return event
      default:
        event.decodedValueName = 'New QueryData w/out JSON'
        event.decodedValue = '0'
        return event
    }
  },
}
