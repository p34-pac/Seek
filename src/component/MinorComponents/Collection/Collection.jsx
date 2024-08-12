/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './Collection.css'
import { ArrowRightIcon } from '../../asset component/Icons/Icons'
import MovieCard from '../../Main Components/MovieCard/MovieCard'
import { useNavigate } from 'react-router-dom'

function Collection({seeAllLink, className, showSeeAll=true, children = <MovieCard play={false} optionDrop={false} shrink={true} />, CollectionName="Collection name"}) {
    const navigate = useNavigate()
  return (
    <div className={className?`collection ${className}`:"collection"}>
        <div className="top">
            <b className="collectionName">{CollectionName}</b>
            
            {
                showSeeAll?
                    <span className="seeAll" onClick={()=>seeAllLink?navigate(seeAllLink):null}>see all
                        <i><ArrowRightIcon fill='var(--baseBlack600)'/></i>
                    </span>
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