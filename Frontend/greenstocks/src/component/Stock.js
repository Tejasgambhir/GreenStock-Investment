import React from 'react';
import { useParams } from 'react-router-dom';
import StockGraphAll from './StockGraphingAll';
import GreenScore from './GreenScore';
import StockDetails from './StockDetails';
import Header from './Header';
function Stock() {
  const { ticker } = useParams();
  // This is a placeholder. Implement your Stock component logic here.
  return (
    <div>
      <Header/>
      <h2 className='text-center mt-5'>Stock Details for {ticker}</h2>
      <GreenScore data = {ticker}/>
      <StockGraphAll ticker = {ticker} timeFrame={"ALL"}/>
      <StockDetails ticker = {ticker} />
    </div>
  );
}

export default Stock;