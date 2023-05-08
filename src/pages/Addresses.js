import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Utils } from "alchemy-sdk";

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

export const alchemy = new Alchemy(settings);


export default function Addresses() {
    const {address} = useParams();
    const [ethBalance, setEthBalance] = useState();
    const [addrBalances, setAddrBalances] = useState([]);

    useEffect(() => {
        async function getBalances() {
            const ethBalance = await alchemy.core.getBalance(address, "latest");
            const etherBalance =  Utils.formatEther(ethBalance).substring(0, 6);
            const balances = await alchemy.core.getTokenBalances(address);
            const nonZeroBalances = balances.tokenBalances.filter((token) => {
                return token.tokenBalance > 0;
            });

            let i = 1;
            let addressBalances = [];
            for (let token of nonZeroBalances) {
                let tokenInfo = {};
                let balance = token.tokenBalance;

                const tokenContract = await alchemy.core.getTokenMetadata(token.contractAddress);

                balance = balance / Math.pow(10, tokenContract.decimals);
                balance = balance.toFixed(2);

                tokenInfo.id = i;
                tokenInfo.name = tokenContract.name;
                tokenInfo.balance = balance;
                tokenInfo.symbol = tokenContract.symbol;

                addressBalances.push(tokenInfo);
                i++;
            }
            
            setEthBalance(etherBalance);
            setAddrBalances(addressBalances);
        };
        getBalances();
    }, [addrBalances, ethBalance]);

    return (
        <div className="address">
            <div>
                <h2> <strong>Address: </strong> {address} </h2>
                <h2 className="address balance"> <strong>Balance: </strong> {ethBalance} ETH </h2>
            </div>
            <br />
            {addrBalances && addrBalances.map((bal, i) => <ul key = {bal.id}><b>{bal.name} ({bal.symbol}): {bal.balance}</b></ul>)}
        </div>
    )
}