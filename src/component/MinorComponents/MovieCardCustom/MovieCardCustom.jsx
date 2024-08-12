/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import MovieCard from '../../Main Components/MovieCard/MovieCard';
import './MovieCardCustom.css'
import { CrewCastIcon } from '../../asset component/Icons/Icons';

export function CastCrewsCard({img, person="Person", position="Position"}){
    return (
        <MovieCard
            className='CastCrewsCard'
            rating={false}
            optionDrop={false}
            before={false}
            verticalAlign={true}
            text1={person}
            text2={position?'as':false}
            text3={position}
            icon={<CrewCastIcon fill='var(--primary1000)'/>}
            imgSrc={img}
            imgAlt={person}
        
        />
    )
}

function MovieCardCustom({onClick, tabled3=true, tabled4=false}){
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [hoverMovieCard, setHoverMovieCard] = useState(false)
    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
      }, [])

      return(
        
        <>
            {
            isLessThan500?
            <>
                <MovieCard onMouseEnter={()=>setHoverMovieCard(true)} 
                    onMouseLeave={()=>setHoverMovieCard(false)}  
                    optionDrop={hoverMovieCard} 
                    optionDropOnRight={hoverMovieCard} 
                    before={false} 
                    shrink
                    onClick={onClick}
                /> 
            </>
            :
            <>
                <MovieCard onMouseEnter={()=>setHoverMovieCard(true)} 
                    onMouseLeave={()=>setHoverMovieCard(false)} 
                    optionDrop={hoverMovieCard} 
                    optionDropOnRight={hoverMovieCard}
                    tabled3={tabled3}
                    tabled4={tabled4}
                    before={false}
                    onClick={onClick}
                />
            </>
        }
        </>
      )
}



export default MovieCardCustom