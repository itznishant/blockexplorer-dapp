import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

export default function Blocks() {
  const {blocknumber} = useParams();
  const [blockTxns, setBlockTxns] = useState();
  const [blockHashes, setBlockHashes] = useState([]);

  useEffect(() => {
    async function blockTransactions() {
      try{
        const block = await alchemy.core.getBlockWithTransactions(parseInt(blocknumber));
        setBlockTxns(block);

        Promise.resolve(block).then((result) => {
          const hash = result.hash;
          const parentHash = result.parentHash;
          setBlockHashes([hash, parentHash]); 
          })
        } catch (error) {
            console.error(error);
        }
    }

    if (blocknumber) {
      blockTransactions();
    }
  }, [blocknumber]);

   useEffect(() => {
    async function blockReward() {
      try {
          const blockHash = blockTxns.hash;
          const hashObj = {
              blockHash: blockHash
          };
      	} catch (error) {
          console.error(error);
        }
      }
      
      if(blockTxns) {
          blockReward();
      }  
  	}, [blockTxns]);

  useEffect(() => {
   }, [])

return(
  <div>
    <div className="blocks"><h2><strong>Block Number: </strong>{blocknumber}</h2></div>

    <div className="blocks__main">
      <div className="blocks__content">
        <div className='flex flex-row'>
          <div className='w-1/3'> <div className='flex'><strong>Block Hash: </strong> </div> </div>
          <div className='w-2/3'> <div className='flex'> {blockHashes[0]} </div> </div>
        </div>
        <br />
        <div className='flex flex-row'>
          <div className='w-1/3'> <div className='flex'><strong>Parent Hash: </strong> </div> </div>
          <div className='w-2/3'> <div className='flex'> {blockHashes[1]} </div> </div>
        </div>
        <br />
        {blockTxns ? (
        <div>
          <div className='flex flex-row'>
            <div className='w-1/3'> <div className='flex'><strong>Block Height: </strong> </div> </div>
            <div className='w-2/3'> <div className='flex'> {blocknumber} </div> </div>
          </div>
          <br />
          <div className='flex flex-row'>
            <div className='w-1/3'> <div className='flex'><strong>Transactions: </strong></div> </div>
            <div className='w-2/3'> <div className='flex flex-row'>
            <div className='pr-1 text-sky-600 cursor-pointer'>{blockTxns.transactions.length} transactions in block</div>
            </div>
            </div>
          </div>
        </div>
        ) : (
          "Loading..."
        )}
    </div>
  </div>
  <div className="blocks__main">
    <div className="blocks__content">
      {blockTxns ? (
        <div>
        <div className='flex flex-row'> 
          <div className='w-1/3'> <div className='flex'><strong> TimeStamp: </strong> </div> </div>
          <div className='w-2/3'> <div className='flex'> {blockTxns.timestamp} </div> </div>
        </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  </div>
  <div className="blocks__main">
    <div className="blocks__content">
      {blockTxns ? (
      <div>
      <div className='flex flex-row'>
        <div className='w-1/3'> <div className='flex'><strong>Fee Recipient: </strong> </div> </div>
        <div className='w-2/3'> <div className='flex'> {blockTxns.miner} </div> </div>
      </div>
      </div>
      ) : (
        "Loading..."
      )}
    </div>
  </div>

  <div className="blocks__main">
    <div className="blocks__content">
      {blockTxns ? (
      <div>
      <div className='flex flex-row'>
        <div className='w-1/3'> <div className='flex'> <strong>Extra Data: </strong></div> </div>
        <div className='w-2/3'> <div className='flex'> {blockTxns.extraData} </div> </div>
      </div>
      </div>
      ) : (
        "Loading..."
      )}
    </div>
  </div>

  <div className="blocks__main">
    <div className="blocks__content">
      {blockTxns ? (
      <div>
      <div className='flex flex-row'>
        <div className='w-1/3'> <div className='flex'> <strong>Nonce: </strong></div> </div>
        <div className='w-2/3'> <div className='flex'> {blockTxns.nonce} </div> </div>
      </div>
      </div>
      ) : (
        "Loading..."
      )}
    </div>
  </div>






  </div>
 )
}
