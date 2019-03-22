import React, { useState } from 'react';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';

import './App.css';

let App = () => {

  let [apiKey, setApiKey] = useState("");
  let [stock, setStock] = useState("");
  let [currentPage, setCurrentPage] = useState(0);
  let [pages, setPages] = useState([]);

  if (apiKey.length === 0) {
    let promptKey = prompt("Set API key:");
    setApiKey(promptKey)
  }

  return (
    <div className="App">
      <header className="App-header">
        <input 
          type="text" 
          id="stock" 
          name="stock" 
          size="30" 
          onChange={event => setStock(event.target.value)}
        />
        <button onClick={() => fetchEarnings(stock, apiKey, setPages)}>Search</button>
      </header>
      <ul>
        {
          pages[currentPage] &&
          pages[currentPage].map((earning, index) => (
            <li key={index}>
              <span>{earning.fiscalPeriod}: {earning.actualEPS} EPS</span>
            </li>
          ))
        }
      </ul>
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(0)}/>
        <Pagination.Prev onClick={() => setCurrentPage(Math.max(currentPage-1, 0))}/>
        {
          pages.map((page, index) => (
            <Pagination.Item 
              key={index} 
              active={index === currentPage}
              onClick={() => setCurrentPage(index)}
            >{index+1}</Pagination.Item>
          ))
        }
        <Pagination.Next onClick={() => setCurrentPage(Math.min(currentPage+1, pages.length-1))}/>
        <Pagination.Last onClick={() => setCurrentPage(pages.length-1)}/>
      </Pagination>
    </div>
  );
}

async function fetchEarnings(stock, apiKey, setPages) {
  let result = await axios.get(`https://cloud.iexapis.com/beta/stock/${stock}/earnings/10?token=${apiKey}`);
  setPages(convertToPages(result.data.earnings));
}

function convertToPages(earnings) {
  let pageIndex = 0;
  // arbitrarily setting pageSize to see pagination results
  let pageSize = 2;
  let pages = [];

  while(pageIndex < earnings.length) {
    pages.push(earnings.slice(pageIndex, pageIndex+pageSize));
    pageIndex += pageSize;
  }

  return pages;

}

export default App;
