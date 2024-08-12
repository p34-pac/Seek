/* eslint-disable no-unused-vars */
import React, { useState } from "react"
import './Volume.css'
import RangePercent from "../Range/rangePercent"


// eslint-disable-next-line react/prop-types
function Volume({ setVolume, volume }) {

  return (
      <section className="volume">
        
        <RangePercent 
          value={volume}
          setValue={val=>{
            setVolume(event.target.valueAsNumber)
          }}
        />

      </section>
  )
}

export default Volume


