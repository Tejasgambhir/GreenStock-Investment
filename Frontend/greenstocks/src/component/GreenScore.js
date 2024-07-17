import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function GreenScore({ticker}) {
  const [esgScore, setesgScore] = useState(null);
  const [greenScore, setgreenScore] = useState(null);
  const [recScore, setrecScore] = useState(null);
  const [error, setError] = useState(null);


  const fetchStockData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/stocks/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setesgScore(data["Overall Score"]);
      setgreenScore(data["green_score"]);
      setrecScore(data["Recommendation_score"]);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    
  <div className="w-100  d-flex p-3 justify-content-between">
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" green-score text-center alert alert-success">
        Green Score: Decent
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(70)} text={`${Math.floor(70)}%`}/> 
      </div>
      </div>
    </div>
   
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className="green-score text-center alert alert-success">
        Green Score: Decent
      </div>
      <div className="d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(70)} text={`${Math.floor(70)}%`}/> 
      </div>
      </div>
    </div>
  
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" green-score text-center alert alert-success">
        Green Score: Decent
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(70)} text={`${Math.floor(70)}%`}/> 
      </div>
      </div>
    </div>
  </div>
  
    
      
  
  )
}