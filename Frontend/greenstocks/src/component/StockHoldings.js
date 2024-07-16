import React, { useState, useEffect } from 'react';

function StockIndex({ onStockSelect, timeFrame }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocksIndex();
  }, []);

  const fetchStocksIndex = async () => {
    let apiUrl = 'http://localhost:8000/api/stocks/';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Function to load images
  const loadImage = async (ticker) => {
    try {
      const image = await import(`../Images/${ticker}.png`);
      return image.default;
    } catch (error) {
      // Attempt to load without '.L' if it fails
      if (ticker.endsWith('.L')) {
        try {
          const modifiedTicker = ticker.replace('.L', '');
          const image = await import(`../Images/${modifiedTicker}.png`);
          return image.default;
        } catch (innerError) {
          console.error('Error loading image:', innerError);
          return '';
        }
      }
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = {};
      for (const stock of holdings) {
        loadedImages[stock.ticker] = await loadImage(stock.ticker);
      }
      setImages(loadedImages);
    };

    if (holdings.length > 0) {
      loadImages();
    }
  }, [holdings]);

  return (
    <div className="stock-holdings">
      <h2>Current Stock Holdings</h2>
      {stocks.map((stock, index) => (
        <button key={`sh_${index}`} className="stock-button" onClick={() => handleStockClick(stock)}>
          <img src={images[stock.ticker]} alt={stock.name} className="stock-image" />
          <div className="stock-details">
            <div className="stock-name">{stock.name}</div>
            <div>{`${stock.shares_held} shares`}</div>
          </div>
          <div className="stock-value-gain">
            <div>{`$${stock.value_held.toFixed(2)}`}</div>
            <div className="gain-loss" style={{ color: stock.profit_loss_percentage < 0 ? 'red' : 'green' }}>
              {`${stock.profit_loss_percentage.toFixed(2)}%`}
            </div>
          </div>  
            <div>00</div>
          <button className='btn btn-primary'>Track</button>
        </button>
      ))}
    </div>
  );
}

export default StockHoldings;
