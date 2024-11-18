import React, { useState, useEffect } from 'react';

const StockDetails = ({ ticker }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/stocks/${ticker}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText} (status: ${response.status})`);
      }
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker) {
      fetchStockData();
    }
  }, [ticker]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (!stockData) {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Company Details</h2>
      <div className="stock-info">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Parameter</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stockData).map((key, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{key}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{stockData[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockDetails;
