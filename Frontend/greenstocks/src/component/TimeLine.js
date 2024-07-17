import React from 'react';

function TimeFrameFlip({ onTimeFrameChange, currentTimeFrame }) {
    return (
      <div className="time-frame-flipper">
        <button className={`time-frame-btn ${currentTimeFrame === '1y' ? 'active' : ''}`} onClick={() => onTimeFrameChange('1y')}>
          Year
        </button>
        <button className={`time-frame-btn ${currentTimeFrame === '1m' ? 'active' : ''}`} onClick={() => onTimeFrameChange('1m')}>
          Month
        </button>
        <button className={`time-frame-btn ${currentTimeFrame === '1d' ? 'active' : ''}`} onClick={() => onTimeFrameChange('1d')}>
          Day
        </button>
      </div>
    );
  }

  export default TimeFrameFlip;
  