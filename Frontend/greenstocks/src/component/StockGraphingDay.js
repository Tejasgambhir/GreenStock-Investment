import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function StockGraphDay({ ticker, timeFrame }) {
    const [stockData, setStockData] = useState([]);
    console.log(timeFrame);
    useEffect(() => {
        // Ensure the ticker value is included in the fetch URL
        fetch(`http://localhost:8000/api/graph_stock/${ticker}/${"1m"}`)
            .then(response => response.json())
            .then(data => setStockData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [ticker]);

    const chartData = {
        labels: stockData.map(data => data.date),
        datasets: [
            {
                label: 'Stock Value',
                data: stockData.map(data => data.value),
                fill: false,
                borderColor: 'rgb(34, 34, 34)', // Darker line for better contrast
                borderWidth: 1,
                tension: 0.1,
                pointRadius: 0,
                hoverRadius: 0,
            }
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
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: 'rgb(34, 34, 34)' // Darker y-axis labels for visibility
                },
                grid: {
                    color: 'rgba(34, 34, 34, 0.1)' // Lighter grid lines for a subtle background
                }
            },
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                ticks: {
                    color: 'rgb(34, 34, 34)', // Darker x-axis labels for better contrast
                    display: true
                },
                grid: {
                    color: 'rgba(34, 34, 34, 0.1)' // Light grid lines for x-axis
                }
            }
        },
        animation: {
            duration: 1000
        }
    };
    
    return (
        <div className="stock-graph-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default StockGraphDay;
