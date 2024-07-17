import React from 'react';

function TimeFrameFlip({ onTimeFrameChange, currentTimeFrame }) {
    return (
      <div className="time-frame-flipper">
        <button className={`time-frame-btn ${currentTimeFrame === 'all' ? 'active' : ''}`} onClick={() => onTimeFrameChange('all')}>
          ALL
        </button>
        <button className={`time-frame-btn ${currentTimeFrame === '1y' ? 'active' : ''}`} onClick={() => onTimeFrameChange('1y')}>
          Year
        </button>
        <button className={`time-frame-btn ${currentTimeFrame === '1m' ? 'active' : ''}`} onClick={() => onTimeFrameChange('1m')}>
          Month
        </button>
      </div>
    );
  }

  export default TimeFrameFlip;
  