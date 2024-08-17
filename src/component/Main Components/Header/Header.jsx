/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import './Header.css'
import { AngleLeftIcon, ArrowRightIcon, LogoWIthText, MoonIcon, SunIcon } from '../../asset component/Icons/Icons'
import Search from '../Search/Search'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../UserContext'

function Left(){
    const navigate = useNavigate()
    return(
        <>
            <span className='logo' onClick={()=>navigate("/")}><LogoWIthText/></span>
            <span className="back"><AngleLeftIcon fill="var(--primary1000)" /></span>
        </>
    )
}



function Header({openProfile, searchParam, customLeft=<Left/>}) {
    const [focused, setFocused] = useState(false)
    const [theme, setTheme] = useState("light")
    const {user, setUser} = useContext(UserContext)

    function toggleTheme(){
        if(theme=="light"){
            setTheme("dark")
        }else if(theme=="dark"){
            setTheme("light")
        }
    }
    
    
  return (
    <div className='Header'>
        <div className={focused?"pageDetail focused":"pageDetail"}>
            {
                focused?<Left/>:customLeft
            }
        </div>

        <div className="userActions">
            <span className="dayTimeSwitch" onClick={toggleTheme}>
                {
                    theme=="light"?
                    <SunIcon/>
                    :theme=="dark"?
                    <MoonIcon fill="var(--baseBlack1000)"/>
                    :<SunIcon/>
                }
            </span>
            <div className="searchInput"><Search loadParam={searchParam} setParentalFocus={(val)=>setFocused(val)}/></div>
            <span className="profile">
                <div className="profileOpen" onClick={openProfile}>
                    {
                        user.dp?<img src={user.dp.src} alt={user.dp.name} />:null
                    }
                </div>
            </span>
        </div>
    </div>
  )
}

export default Header