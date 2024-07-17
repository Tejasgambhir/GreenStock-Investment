import React from 'react';
import { useParams } from 'react-router-dom';
import StockGraphAll from './StockGraphingAll';
// import greenScore from './greenScore';
import StockDetails from './StockDetails';
import Header from './Header';
function Stock() {
  const { ticker } = useParams();
  // This is a placeholder. Implement your Stock component logic here.
  return (
    <div>
      <Header/>
      <h2>Stock Details for {ticker}</h2>
      {/* <greenScore data = {ticker}/> */}
      {/* <StockGraphAll ticker = {ticker} timeFrame={"ALL"}/> */}
      <StockDetails ticker = {ticker} />
      {/* Render stock details here */}
    </div>
  );
}

export default Stock;