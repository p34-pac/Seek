/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './Collection.css'
import { ArrowRightIcon } from '../../asset component/Icons/Icons'
import MovieCard from '../../Main Components/MovieCard/MovieCard'
import { useNavigate } from 'react-router-dom'

function SeeAll({seeAllLink, navigate, onClick=()=>{return}}){
    function handleClick(){
        if(seeAllLink){
            navigate(seeAllLink)
        }
        onClick()
    }
    return(
        <span className="seeAll" onClick={handleClick}>see all
            <i><ArrowRightIcon fill='var(--baseBlack1000)'/></i>
        </span>
    )
}


function Collection({seeAll=false,seeAllLink, className, seeAllAction=()=>{return}, showSeeAll=true, children = <MovieCard play={false} optionDrop={false} shrink={true} />, CollectionName="Collection name"}) {
    const navigate = useNavigate()
  return (
    <div className={className?`collection ${className}`:"collection"}>
        <div className="top">
            <b className="collectionName">{CollectionName}</b>
            
            {
                showSeeAll?
                    !seeAll?<SeeAll onClick={seeAllAction} navigate={navigate} seeAllLink={seeAllLink}/>:seeAll
                :null
            }
        </div>

        <div className="content">
            {children}
        </div>
    </div>
  )
}

export default Collection