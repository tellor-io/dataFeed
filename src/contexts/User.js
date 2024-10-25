import React, { useState, createContext, useEffect } from 'react';
//Utils
import chains from "../utils/chains";
import { getAssetBalances } from "../utils/helpers";
//Web3
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const UserContext = createContext();

//Web3 Modal Globals
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "52474cef7b964b4fbf8e954a5dfa481b", // required
        },
    },
};
const web3Modal = new Web3Modal({
    providerOptions, // required
    cacheProvider: true,
});

const User = ({ children }) => {
    //Context State
    const [currentUser, setCurrentUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [setupUserError, setSetupUserError] = useState(null);
    const [eventsOn, setEventsOn] = useState(false);
    
    const setupUser = async () => {
        try {
            let user = { web3Modal: web3Modal };
            user.provider = await web3Modal.connect();
            user.web3 = new Web3(user.provider);
            const chainId = await user.web3.eth.getChainId();
            user.address = (await user.web3.eth.getAccounts())[0];
            user.network = chains[chainId];
            user.chainId = chainId;
            user.balances = await getAssetBalances(user.web3, user.address, chainId);
            return user;
        } catch (err) {
            // console.log(err);
            setSetupUserError(err.message);
        }
    };

    //UseEffect on "connected = true" flag,
    //sets up user and network
    useEffect(() => {
        if (web3Modal && connected) {
            //if check for when user stops login flow
            if (currentUser !== undefined && currentUser !== null) return;
            web3Modal.clearCachedProvider();
            setupUser().then(res => {
                setCurrentUser(res);
            })
            setEventsOn(true);
        }
    }, [connected]) //eslint-disable-line

    //useEffect that checks for when user stops login flow,
    //and resets.
    useEffect(() => {
        if (currentUser === undefined) {
            setConnected(false);
        } else if (currentUser === undefined && connected) {
            setConnected(false);
        } else if (currentUser !== undefined && currentUser !== null) {
            setConnected(true);
        }
    }, [currentUser, connected])

    //Turning on events subscription 
    //ONLY on first web3 injection 
    // (the "connected = true" useEffect),
    //to prevent memory leaks and
    //keep event listeners cleaned up.
    if (currentUser && eventsOn) {
        // Subscribe to chains change
        window.ethereum.on("chainChanged", () => {
            setupUser().then(res => {
                setCurrentUser(res);
            })
        });
        // Subscribe to accounts change
        window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length === 0) {
                web3Modal.clearCachedProvider();
            } else {
                setupUser().then(res => {
                    setCurrentUser(res);
                });
            }
        });
        setEventsOn(false);
    }
    
    const UserContextObject = {
        currentUser: currentUser,
        connected: connected,
        setupUserError: setupUserError,
        setCurrentUser: setCurrentUser,
        setConnected: setConnected,
        setSetupUserError: setSetupUserError,
        setupUser: setupUser,
    }

    return (
        <UserContext.Provider value={UserContextObject}>
            {children}
        </UserContext.Provider >
    );
};

export default User;
