/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import './rangePercent.css'
import classNames from "classnames";

// eslint-disable-next-line react/prop-types
function RangePercent({ setValue=null, value=10, click, style, disc=true}) {
  const [valueState, setValueState] = useState(value);
  const rangeClass = classNames("MediaRange", {disc})

  const handleDrag = (event) => {
    setValue(event.target.valueAsNumber);
  };
  
  useEffect(() => {
    setValueState(value)
  }, [value]);


  return (
    <div className='MediaRange' style={style}>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={valueState}
        className="slider"
        onChange={handleDrag}
        onClick={click}
      />
      <div className="rest" style={valueState<30?{width: `calc(100% - ${valueState}%`}:{width: `calc(100% - (${valueState}%) + 5px)`}}></div>
      <div className="done" style={valueState<30?{width: `calc(${valueState}% + 10px)`}:{width: `${valueState}%`}}></div>
  </div>

  )
}

export default RangePercent


