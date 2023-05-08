import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
const alchemy = new Alchemy(settings);

export default function Transactions() {
  const { transaction } = useParams();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [txValue, setTxValue] = useState();
  const [otherDetails, setOtherDetails] = useState([]);

  useEffect(() => {
      async function getTxDetails() {
        const txDetails = await alchemy.core.getTransactionReceipt(transaction);
        const from = txDetails.from;
        const to   = txDetails.to;

        const details = await alchemy.core.getTransaction(transaction);
        const txvalue =  Utils.formatEther(details.value._hex).substring(0, 6);
        const txIndex = details.transactionIndex.toString();
        const nonce = details.nonce.toString();        
        const confirmations = details.confirmations.toString();
        
        setFrom(from);
        setTo(to);
        setTxValue(txvalue);
        setOtherDetails([txIndex, nonce, confirmations]);
      };
    getTxDetails();
  }, [transaction, from, to, txValue, otherDetails]);
    
  return (
  <div>
    <div className="transaction">
      <h2> Transaction: {transaction} </h2>
    </div>
    <div>
      <h3>
          <p className="transaction__content"><strong>From: </strong></p>
          <p className="transaction__content"> <Link className="App__link"to={`/address/${from}`}>{from}</Link> </p>
          <p className="transaction__content"><strong>To: </strong></p>
          <p className="transaction__content"> <Link className="App__link"to={`/address/${to}`}>{to}</Link> </p>
          <p className="transaction__content"><strong>Value: </strong></p>
          <p className="transaction__content"> {txValue} <strong>ETH</strong> </p>
          <p className="transaction__content"><strong>Tx Position: </strong></p>
          <p className="transaction__content"> {otherDetails[0]} </p>
          <p className="transaction__content"><strong>Tx Nonce: </strong></p>
          <p className="transaction__content"> {otherDetails[1]} </p>
          <p className="transaction__content"><strong>Tx Confirmations: </strong></p>
          <p className="transaction__content"> {otherDetails[2]} </p>          
      </h3>
    </div>
  </div>
  )
}
