import React from 'react';
import StockGraphAll from './StockGraphingAll';
// import greenScore from './greenScore';
import StockIndex from './StockIndex';
function Stock({ ticker }) {
  // This is a placeholder. Implement your Stock component logic here.
  return (
    <div>
      <h2>Stock Details for {ticker}</h2>
      {/* <greenScore data = {ticker}/> */}
      <StockGraphAll ticker = {ticker} timeFrame={"ALL"}/>
      <StockIndex/>
      {/* Render stock details here */}
    </div>
  );
}

export default Stock;