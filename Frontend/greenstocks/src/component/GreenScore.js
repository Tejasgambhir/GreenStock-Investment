import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function GreenScore({data}) {
    

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