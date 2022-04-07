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
    }
    newDataFeedEntities(orderBy: id, orderDirection: desc) {
      id
      _token
      _queryId
      _feedId
    }
    oneTimeTipClaimedEntities(orderBy: id, orderDirection: desc) {
      id
      _queryId
      _token
      _amount
    }
    tipAddedEntities(orderBy: id, orderDirection: desc) {
      id
      _token
      _queryId
      _amount
      _queryData
    }
    tipClaimedEntities(orderBy: id, orderDirection: desc) {
      id
      _feedId
      _queryId
      _token
      _amount
    }
  }
`
