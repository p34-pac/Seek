/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './UserDp.css'
import { AddIcon } from '../../asset component/Icons/Icons'

function UserDp({userInfo}) {
  return (
    <div className='UserDp'>
        <div className="cover"></div>
        <div className="userInfo">
            <div className="userDpPhoto">
              <span><AddIcon fill='var(--baseWhite1000)' /></span>
            </div>
            <b className="Id">{userInfo&&userInfo.name?userInfo.name:'username'}</b>
        </div>
    </div>
  )
}

export default UserDp