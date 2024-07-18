import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function StockGraphAll({ ticker, timeFrame }) { // Use destructuring to get the ticker prop
    const [stockData, setStockData] = useState([]);
    
   
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
                borderWidth: 1,
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
            // Set the background color of the chart to white
            background: {
                color: 'white'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: 'rgba(75, 192, 192, 1)', // Color of y-axis labels
                },
                grid: {
                    color: 'rgba(75, 192, 192, 0.2)' // Color of y-axis grid lines
                }
            },
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    displayFormats: {
                        month: 'dd-MM-yy-HH:mm'
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