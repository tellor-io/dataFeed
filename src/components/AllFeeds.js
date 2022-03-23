import React from 'react'
import '../styles/AllFeeds.css'
import Table from './Table'

function AllFeeds() {
  return (
    <div>
      <Table />
      <button className="AllFeeds__Button">load more</button>
    </div>
  )
}

export default AllFeeds
