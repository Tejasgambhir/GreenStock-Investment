import React, { useEffect, useState } from 'react'; 

function GreenNews() {
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/news/')
            .then(response => response.json())
            .then(data => setNewsData(data))
            .catch(error => console.error('Error fetching news:', error));
    }, []);

    return (
        <div className="GreenNews">
            <div className="news-container">
                {newsData.map((news, index) => (
                    <div className="news-item" key={index}>
                        <img src={news.image} alt="news" className="news-image"/>
                        <div className="news-content">
                            <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                                {news.title}
                                {news.summary}
                            </a>
                            <p className="news-source">{news.source}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GreenNews;