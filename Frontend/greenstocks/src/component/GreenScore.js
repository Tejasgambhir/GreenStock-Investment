import React , {useState,useEffect} from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function GreenScore({ticker}) {

  const [EScore, setEScore] = useState(null);
  const [SScore, setSScore] = useState(null);
  const [GScore, setGScore] = useState(null);
  const [greenScore, setgreenScore] = useState(null);
  const [recScore, setrecScore] = useState(null);
  const [washScore, setwashScore] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockScore = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/getscores/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setEScore(data["Environmental Pillar Score"]);
      setSScore(data["Social Pillar Score"]);
      setGScore(data["Governance Pillar Score"]);
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


  const fetchgreenWash = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/greenwash/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data['greenwashing_detected']);
      setwashScore(data['greenwashing_detected']);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  useEffect(() => {
    if (ticker) {
      fetchgreenWash(ticker);
    }
  }, [ticker]);


  const score =100; // If true, score is 100; if false, score is 0
  
  // Set color based on GScore
  const color = washScore ? 'red' : 'green';
  const text = washScore ? "Yes" : "No";
  // Define the custom styles for the CircularProgressbar
  const progressBarStyles = {
    path: {
      stroke: color, // dynamic color based on GScore
    },
    text: {
      fill: color, // optional, to set the text color too
    },
  };

  return (
    
  <div className="w-100  d-flex p-3 justify-content-between">
    <div className="row bg-gradient-success score-container m-3 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" text-white green-score text-center alert alert-success">
        <p className='text-white'>Green Score</p>
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(EScore)} text={`${Math.floor(EScore)}%`}/> 
      </div>
      </div>
    </div>
   
    <div className="row bg-gradient-success score-container m-3 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className="green-score text-center alert alert-success">
        
        <p className='text-white'>Environmental Score</p>
      </div>
      <div className="d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(EScore)} text={`${Math.floor(EScore)}%`}/> 
      </div>
      </div>
    </div>
    <div className="row bg-gradient-success score-container m-3 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className="green-score text-center alert alert-success">
       
        <p className='text-white'>Social Score</p>
      </div>
      <div className="d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(SScore)} text={`${Math.floor(SScore)}%`}/> 
      </div>
      </div>
    </div>
    <div className="row bg-gradient-success score-container m-3 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className="green-score text-center alert alert-success">
        
        <p className='text-white'>Goverance Score</p>
      </div>
      <div className="d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={Math.floor(GScore)} text={`${Math.floor(GScore)}%`}/> 
      </div>
      </div>
    </div>
  
    <div className="row bg-gradient-success score-container m-4 p-5 d-flex flex-column justify-content-center align-items-center ">
      <div className=" green-score text-center alert alert-success">
        
        <p className='text-white'>Potential GreenWashing</p>
      </div>
      <div className=" d-flex align-items-center justify-content-center  text-center">
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar
          value={score}
          text={text}
          styles={progressBarStyles}
        />
      </div>
      </div>
    </div>
  </div>
  
    
      
  
  )
}