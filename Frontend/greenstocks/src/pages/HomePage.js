// src/Page.js
import React from 'react';
import Header from '../component/Header';
import StockIndex from '../component/StockIndex';

function HomePage() {
  return (
    <div>
      <Header />
      <StockIndex/>
    </div>
  );
}

export default HomePage;
