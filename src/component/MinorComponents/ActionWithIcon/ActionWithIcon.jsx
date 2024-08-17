/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './ActionWithIcon.css'
import { AngleRightIcon } from '../../asset component/Icons/Icons'

function ActionWithIcon({onClick=()=>{return}, className='', iconFill="var(--baseBlack1000)", icon=<AngleRightIcon fill={iconFill}/>, children}) {
  
  return (
    <span onClick={()=>onClick()} className={`ActionWithIcon ${className}`}>
        <b>{children}</b>
        <i>{icon}</i>
    </span>
  )
}

export default ActionWithIcon