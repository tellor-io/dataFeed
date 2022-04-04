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
        }).format(event.value / 1000000)
        return event
      case 2:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event.value / 1000000)
        return event
      case 10:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue =
          event.value.toString().length > 17
            ? new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
              }).format(event.value / eighteenDecimals)
            : new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
              }).format(event.value / 1000000)
        return event
      case 41:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue =
          event.value.toString().length > 18
            ? (event.value / eighteenDecimals).toString()
            : event.value.toString().length > 6
            ? '*' + (event.value / 1000000).toString()
            : '*' + event.value.toString()
        return event
      case 50:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event.value / 1000000)
        return event
      case 59:
        event.decodedValueName = psrLookup[event.queryId].name
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'JPY',
        }).format(event.value / 1000000)
        return event
      default:
        event.decodedValueName = 'New Legacy Type'
        event.decodedValue = '0'
        return event
    }
  },
  CoinPrice: (event) => {
    switch (event.newQueryData.coin) {
      case 'btc':
        event.decodedValueName = `${
          event.newQueryData.price_type
            ? event.newQueryData.price_type.charAt(0).toUpperCase() +
              event.newQueryData.price_type.slice(1)
            : ''
        } ${
          event.newQueryData.coin ? event.newQueryData.coin.toUpperCase() : ''
        }/${
          event.newQueryData.currency
            ? event.newQueryData.currency.toUpperCase()
            : ''
        }`
        event.decodedValue = new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'USD',
        }).format(event.value / 1000000)
        return event
      default:
        event.decodedValueName = 'New CoinPrice Type'
        event.decodedValue = '0'
        return event
    }
  },
  SpotPrice: (event) => {
    switch (event.newQueryData.asset) {
      case 'wampl':
        event.decodedValueName = `${
          event.newQueryData.type
            ? event.newQueryData.type
            : 'No queryData type'
        } ${
          event.newQueryData.asset
            ? event.newQueryData.asset.toUpperCase()
            : 'No queryData asset'
        }/${
          event.newQueryData.currency
            ? event.newQueryData.currency.toUpperCase()
            : ''
        }`
        event.decodedValue = event.value
          ? new Intl.NumberFormat('en-EN', {
              style: 'currency',
              currency: 'USD',
            }).format(event.value / eighteenDecimals)
          : 'No Value'
        return event
      default:
        event.decodedValueName = 'New SpotPrice Type'
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
