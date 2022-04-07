import React, { useContext, useEffect } from 'react'
import '../styles/MyFeeds.css'
//Context
import { UserContext } from '../../contexts/User'
//Components
import Table from '../../components/Table'

function MyFeeds() {
  const user = useContext(UserContext)

  //In case user exits MetaMask or Walletconnect
  //Halfway through login process
  useEffect(() => {
    if (!user) return
    if (
      user.setupUserError === 'User closed modal' ||
      user.setupUserError === 'User Rejected'
    ) {
      user.setConnected(false)
      user.setSetupUserError(null)
    }
  }, [user])

  const startFlow = () => {
    if (user) {
      user.setConnected(true)
    }
  }
  return (
    <div className="MyFeedsContainer">
      {user && user.currentUser ? (
        <Table />
      ) : (
        <button className="MyFeeds__Button" onClick={() => startFlow()}>
          connect your wallet to see your feeds
        </button>
      )}
    </div>
  )
}

export default MyFeeds
