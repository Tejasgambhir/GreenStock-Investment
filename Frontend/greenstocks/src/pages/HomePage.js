// src/Page.js
import React from 'react';
import Header from '../component/Header';
import StockIndex from '../component/StockIndex';
import HomePageImage from '../component/HomePageImage';
import Footer from '../component/footer';
function HomePage() {
  return (
    <div>
      <Header />
      <HomePageImage/>
      <StockIndex/> 
      <Footer/>
    </div>
  );
}

export default HomePage;
