import React from 'react';
import { Link } from "react-router-dom";

function LatestBlocks(props) {
    const { blocks } = props;

  return (
    <div className="latestblocks_main">
        {blocks.map((block, index) => (
            <div className="latestblocks latestblocks_border" key={block.blockNumber}>
                <Link className="App__link" to={`/block/${block.blockNumber}`}>{block.blockNumber}</Link>
            </div>
        ))}
    </div>
  )
}

export default LatestBlocks;