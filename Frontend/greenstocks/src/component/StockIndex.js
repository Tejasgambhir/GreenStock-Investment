import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the Stock component

function StockIndex() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null); // State for selected stock ticker
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
            return '';
          }
        } else {
          return '';
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
    setSelectedTicker(ticker); // Set the selected stock ticker
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const defaultImage = 'Frontend\\greenstocks\\src\\Images\\default.jpg';

  return (
    <div className="stock-holdings">
      {selectedTicker ? (
        navigate(`/stocks/${selectedTicker}`)// Render Stock component with selected ticker
      ) : (
        stocks.map((stock) => (
          <button key={`sh_${stock.ticker}`} className="stock-button" onClick={() => handleStockClick(stock.ticker)}>
            <img src={images[stock.ticker] || defaultImage} 
            alt={stock.name} className="stock-image" />
            <div className="stock-details">
              <div className="stock-name">{stock.name}</div>
            </div>
            <div>{`ESG : ${stock.esg_score}`}</div>
            <button className="btn btn-primary">Track</button>
          </button>
        ))
      )}
    </div>
  );
}

export default StockIndex;