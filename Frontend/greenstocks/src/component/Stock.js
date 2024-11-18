import React,{useState} from 'react';
import { useParams } from 'react-router-dom';
import StockGraphAll from './StockGraphingAll';
import GreenScore from './GreenScore';
import StockDetails from './StockDetails';
import StockGraphDay from './StockGraphingDay';
import StockGraphMonth from './StockGraphingMonth';
import Header from './Header';
import TimeFrameFlip from './TimeLine';
import Footer from './footer';
function Stock() {
  const { ticker } = useParams();
  const [timeFrame, setTimeFrame] = useState('1m');

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

 
  return (
    <div  >
      <Header/>
      <h2 className='text-center mt-5'>Stock Details for {ticker}</h2>
      <GreenScore ticker = {ticker}/>
      <div className='stock-info'>

      <TimeFrameFlip onTimeFrameChange={handleTimeFrameChange} currentTimeFrame={timeFrame}/>
      {timeFrame === "all" && <StockGraphAll  ticker = {ticker} timeFrame={timeFrame}/>}
      {timeFrame === "1y" && <StockGraphMonth ticker = {ticker} timeFrame={timeFrame}/>}
      {timeFrame === "1m" && <StockGraphDay ticker = {ticker} timeFrame={timeFrame}/>}
    </div>
      <StockDetails ticker = {ticker} />
      <Footer/>
    </div>
  );
}

export default Stock;