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
      console.log(typeof(data));
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
      {/* <h2>{stockData.companyname} ({stockData.tickersymbol})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Company Details</h3>
          <p>Industry: {stockData.industry}</p>
          <p>Country: {stockData.country}</p>
          <p>Exchange: {stockData.exchangename}</p>
          <p>Year: {stockData.Year}</p>
        </div>
        <div>
          <h3>Scores</h3>
          <p>Overall Score: {stockData['Overall Score'].toFixed(2)}</p>
          <p>Overall Transparency Score: {stockData['Overall Transparency Score'].toFixed(2)}</p>
          <p>Environmental Pillar Score: {stockData['Environmental Pillar Score'].toFixed(2)}</p>
          <p>Social Pillar Score: {stockData['Social Pillar Score'].toFixed(2)}</p>
          <p>Governance Pillar Score: {stockData['Governance Pillar Score'].toFixed(2)}</p>
        </div>
        <div>
          <h3>Rankings</h3>
          <p>Overall Global Rank: {stockData['Overall Score Global Rank']}</p>
          <p>Overall Industry Rank: {stockData['Overall Industry Rank']}</p>
          <p>Overall Region Rank: {stockData['Overall Region Rank']}</p>
        </div>
        <div>
          <h3>Additional Info</h3>
          <p>Latest Score Date: {stockData['Latest Score Date']}</p>
          <p>Request ID: {stockData.request_id}</p>
        </div>
      </div> */}
        <header className="App-header">
        <div className="header-content">
          <div className="title-container">
            <h1>
              {/* {selectedStock ? `${selectedStock.name}` : "Overall Portfolio"} */}
              Overall Portfolio
            </h1>
          </div>
          {/* <TimeFrameFlip
            onTimeFrameChange={handleTimeFrameChange}
            currentTimeFrame={timeFrame}
          /> */}
        </div>
        {/* {!selectedStock && timeFrame === "Day" && <AllGraphingDay />} */}
        {(
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
                {Object.keys(stockData).map((key, index) => (  // Iterate over object keys
                <tr key={index}>
                  <td>{key}</td>  {/* Display key as parameter */}
                  <td>{stockData[key]}</td>  {/* Display value */}
                </tr>
              ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default StockDetails;
