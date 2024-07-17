import React , {useState,useEffect} from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function GreenScore({ticker}) {
  const [esgScore, setesgScore] = useState(null);
  const [greenScore, setgreenScore] = useState(null);
  const [recScore, setrecScore] = useState(null);
  const [error, setError] = useState(null);


  const fetchStockScore = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/getscores/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setesgScore(data["Overall Score"]);
      setgreenScore(data["green_score"]);
      setrecScore(data["Recommendation_score"]);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  useEffect(() => {
    if (ticker) {
      fetchStockScore();
    }
  }, [ticker]);


  return (
    
  <div className="w-100  d-flex p-3 justify-content-between">
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" green-score text-center alert alert-success">
        ESG Score: Decent
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(esgScore)} text={`${Math.floor(esgScore)}%`}/> 
      </div>
      </div>
    </div>
   
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className="green-score text-center alert alert-success">
        Green Score: Decent
      </div>
      <div className="d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(greenScore)} text={`${Math.floor(greenScore)}%`}/> 
      </div>
      </div>
    </div>
  
    <div className="row bg-gradient-success score-container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" green-score text-center alert alert-success">
        Recommendation Score: Decent
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(recScore )} text={`${Math.floor(recScore)}%`}/> 
      </div>
      </div>
    </div>
  </div>
  
    
      
  
  )
}