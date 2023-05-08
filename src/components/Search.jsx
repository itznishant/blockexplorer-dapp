import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const hist = useHistory();

    function handleChange(e) {
        e.preventDefault();
        setSearchTerm(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            if(e.target.value.startsWith('0x') && e.target.value.length === 66) {
                hist.push(`/transaction/${searchTerm}`);
            } else if(e.target.value.startsWith('0x') && e.target.value.length === 42) {
                hist.push(`/address/${searchTerm}`);
            } else {
                hist.push(`/404`);
            }
        }
    };

  return (
    <form className="container transaction__detail">
        <input 
            className="search-box border-2 border-gray-300 rounded w-full"
            type="search"
            placeholder="Type Transaction Hash or Wallet Address"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    </form>
  )
}

export default Search;