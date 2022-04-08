import React, { useContext } from 'react'
//Assets
import { ReactComponent as Tellor } from '../../assets/tellor_white.svg'
import { ReactComponent as TellorDark } from '../../assets/tellor.svg'
//Components
//import WalletConnect from "./WalletConnect";
//Styles
import '../../styles/frontendBoilerplate/Nav.css'
//Contexts
import { ModeContext } from '../../contexts/Mode'

function Nav() {
  const mode = useContext(ModeContext)
  return (
    <div className="Nav">
      <a
        href="https://tellor.io/"
        alt="https://tellor.io/"
        rel="noopener noreferrer"
      >
        {mode && mode.mode === 'dark' ? (
          <Tellor className="TellorLogo" />
        ) : (
          <TellorDark className="TellorLogo" />
        )}
      </a>
      {/* <WalletConnect /> */}
    </div>
  )
}

export default Nav
