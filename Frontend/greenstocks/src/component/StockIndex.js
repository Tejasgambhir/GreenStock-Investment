import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import defaultImage from '../Images/RR.png'; 

function StockIndex() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const navigate = useNavigate();

  const fetchStocksIndex = async () => {
    let apiUrl = 'http://localhost:8000/api/stocksindex/';

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStocks(JSON.parse(data));
      setLoading(false);
    } catch (error) {
      console.error('Fetching data failed:', error);
      setError('Error fetching stock data');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStocksIndex();

    // Set up the interval to fetch data regularly
    const intervalId = setInterval(fetchStocksIndex, 1000);
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadImage = async (ticker) => {
      try {
        const image = await import(`../Images/${ticker}.png`);
        return image.default;
      } catch (error) {
        if (ticker.endsWith('.L')) {
          try {
            const modifiedTicker = ticker.replace('.L', '');
            const image = await import(`../Images/${modifiedTicker}.png`);
            return image.default;
          } catch (innerError) {
            return defaultImage;
          }
        } else {
          return defaultImage;
        }
      }
    };
    

    const loadImages = async () => {
      const loadedImages = {};
      for (const stock of stocks) {
        loadedImages[stock.ticker] = await loadImage(stock.ticker);
      }
      setImages(loadedImages);
    };

    if (stocks.length > 0) {
      loadImages();
    }
  }, [stocks]);

  const handleStockClick = (ticker) => {
    setSelectedTicker(ticker);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  // console.log(stocks);
  return (
    <>
      <div class="stock-list-heading my-4">
      <h1>Stock List</h1>
    </div>
     

      <div className="stock-header">
        <div className="header-name">Logo</div>
        <div className="header-name">Stock Name</div>
        <div className="header-esg">ESG Score</div>
        <div className="header-esg">Actual score</div>
        <div className="header-price">Current Price</div>
        <div className="header-track">Track</div>
      </div>

    <div className="stock-holdings">
      {selectedTicker ? (
        navigate(`/stocks/${selectedTicker}`)
      ) : (
        stocks.map((stock) => (
          <button key={`sh_${stock.ticker}`} className="stock-button" onClick={() => handleStockClick(stock.ticker)}>
            <img src={images[stock.ticker] || defaultImage} alt={stock.name} className="stock-image" />
            <div className="stock-details">
              <div className="stock-name">{stock.name }</div>
            </div>
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar value={Math.floor(stock.esg_score)} text={`${Math.floor(stock.esg_score)}%`} />
            </div>
            <div className="gain-loss" style={{ color: Math.floor(stock.value_change) < 0 ? 'red' : 'green' }}>
              {`${stock.value_change?.toFixed(2)} (${stock.value_percentage?.toFixed(2)}%)`}
            </div>
            <div>{stock.current_price} &#8377;</div>  
            <button className="btn btn-primary">Track</button>
          </button>
        ))
      )}
   </div>

        </>
  );
}

export default StockIndex;
