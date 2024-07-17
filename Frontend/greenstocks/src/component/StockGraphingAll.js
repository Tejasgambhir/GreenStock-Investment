import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function StockGraphAll({ ticker, timeFrame }) { // Use destructuring to get the ticker prop
    const [stockData, setStockData] = useState([]);
    console.log(timeFrame)
   
    useEffect(() => {
        // Ensure the ticker value is included in the fetch URL
        fetch(`http://localhost:8000/api/graph_stock/${ticker}/${"all"}`)
            .then(response => response.json())
            .then(data => setStockData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [ticker]);

    const chartData = {
        labels: stockData.map(data => data.date),
        datasets: [
            {
                // Dataset for stock value
                label: 'Stock Value',
                data: stockData.map(data => data.value),
                fill: false,
                borderColor: 'rgb(75, 245, 192)',
                borderWidth: 0.8,
                tension: 0.1,
                pointRadius: 0,
                hoverRadius: 0,
            },
            
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
        },
        scales: {
            y: {
                beginAtZero: false 
            },
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        month: 'dd-MM-yy'
                    }
                },
                ticks: {
                    display: false
                }
            }
        },
        animation: {
            duration: 1000 // Animation duration in milliseconds
        }
    };
    


    return (
        
        <div className="stock-graph-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default StockGraphAll;