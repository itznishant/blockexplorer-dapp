import React, { useState, useEffect } from 'react'; 
import { Network } from 'alchemy-sdk'; 

function Navbar() {
  const [ethPrice, setEthPrice] = useState("");
  const network = Network.ETH_MAINNET.toUpperCase();

  useEffect( () => {
      async function getPrice() {
          const URL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
          let req = await fetch(URL);
          let response = await req.json();
          let ethPrice = response.ethereum.usd;
          setEthPrice(ethPrice);
      }
      getPrice();
  }, []);

  return (
    <nav>
      <div className="nav__topbar__left">ETH PRICE: {ethPrice} USD</div>
      <div className="nav__title"> <h2>BLOCK EXPLORER</h2> </div>
      <div className="nav__topbar__right">NETWORK: {network}</div>
    </nav>
  );
}

export default Navbar;
