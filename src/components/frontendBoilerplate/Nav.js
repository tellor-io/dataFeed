import React from "react";
//Assets
import {ReactComponent as Tellor} from "../../assets/tellor_white.svg";
//Components
import WalletConnect from "./WalletConnect";
//Styles
import "../../styles/frontendBoilerplate/Nav.css";

function Nav() {
  return (
    <div className="Nav">
      <a 
        href="https://tellor.io/"
        alt="https://tellor.io/"
        rel="noopener noreferrer"
      >
        <Tellor className="TellorLogo"/>
      </a>
      <WalletConnect />
    </div>
  )
}

export default Nav