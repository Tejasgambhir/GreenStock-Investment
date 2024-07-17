import React,{useState} from 'react';
import { useParams } from 'react-router-dom';
import StockGraphAll from './StockGraphingAll';
import GreenScore from './GreenScore';
import StockDetails from './StockDetails';
import StockGraphDay from './StockGraphingDay';
import StockGraphMonth from './StockGraphingMonth';
import Header from './Header';
import TimeFrameFlip from './TimeLine';
function Stock() {
  const { ticker } = useParams();
  const [timeFrame, setTimeFrame] = useState('1y');

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };
  // This is a placeholder. Implement your Stock component logic here.
  console.log(ticker)
  return (
    <div>
      <Header/>
      <h2 className='text-center mt-5'>Stock Details for {ticker}</h2>
      <GreenScore data = {ticker}/>
      <TimeFrameFlip onTimeFrameChange={handleTimeFrameChange} currentTimeFrame={timeFrame}/>
      {timeFrame === "1y" && <StockGraphAll  ticker = {ticker} timeFrame={timeFrame}/>}
      {timeFrame === "1m" && <StockGraphMonth ticker = {ticker} timeFrame={timeFrame}/>}
      {timeFrame === "1d" && <StockGraphDay ticker = {ticker} timeFrame={timeFrame}/>}

      <StockDetails ticker = {ticker} />
    </div>
  );
}

export default Stock;