import { gql } from '@apollo/client'

export const reporterQuery = gql`
  query {
    newReportEntities(orderBy: _time, orderDirection: desc) {
      id
      _nonce
      _queryData
      _queryId
      _time
      _value
      _reporter
      txnHash
    }
  }
`

export const reporterWRewardQuery = gql`
  query {
    newReportEntities(orderBy: _time, orderDirection: desc) {
      id
      _nonce
      _queryData
      _queryId
      _reward
      _time
      _value
      _reporter
      txnHash
    }
  }
`

export const autopayQuery = gql`
  query {
    dataFeedFundedEntities(orderBy: id, orderDirection: desc) {
      id
      _queryId
      _feedId
      _amount
      _feedFunder
    }
    newDataFeedEntities(orderBy: id, orderDirection: desc) {
      id
      _queryId
      _feedId
      _queryData
      _feedCreator
    }
    oneTimeTipClaimedEntities(orderBy: id, orderDirection: desc) {
      id
      _queryId
      _amount
      _reporter
    }
    
    tipAddedEntities(orderBy: id, orderDirection: desc) {
      id
      _queryId
      _amount
      _queryData
      _tipper
    }
    tipClaimedEntities(orderBy: id, orderDirection: desc) {
      id
      _feedId
      _queryId
      _amount
      _reporter
    }
    dataFeedEntities(orderBy: id, orderDirection: desc) {
      id
      _reward
      _startTime
      _interval
      _window
      _priceThreshold
    }
  }
`
