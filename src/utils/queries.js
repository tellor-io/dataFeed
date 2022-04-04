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
