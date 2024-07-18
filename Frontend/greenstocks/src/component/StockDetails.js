import React, { useState, useEffect } from 'react';

const StockDetails = ({ ticker }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/stocks/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  useEffect(() => {
    if (ticker) {
      fetchStockData();
    }
  }, [ticker]);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <header className="App-header">
        <div className="header-content">
          <div className="title-container">
            <h1>Company Details</h1>
          </div>
        </div>
        <div className="stock-info">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(stockData).map((key, index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{stockData[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </header>
    </div>
  );
};

export default StockDetails;
