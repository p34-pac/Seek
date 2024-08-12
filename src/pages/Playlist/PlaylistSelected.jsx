/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './Playlist.css'
import Header from '../../component/Main Components/Header/Header'
import Profile from '../../component/Main Components/Profile/Profile'
import PlayListCover from '../../component/MinorComponents/PlayListCover/PlayListCover'
import PlayListTypeTableHead from '../../component/MinorComponents/PlayListTypeTableHead/PlayListTypeTableHead'
import MovieCard from '../../component/Main Components/MovieCard/MovieCard'
import MovieCardCustom from '../../component/MinorComponents/MovieCardCustom/MovieCardCustom'
import imgdef from "../../assets/images/Trends International Naruto Shippuden - Group Wall Poster, 22_375_ x 34_, Unframed Version 1.png"
import { useNavigate } from 'react-router-dom'

function PlaylistSelected() {
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [hoverMovieCard, setHoverMovieCard] = useState(false)
    const navigate = useNavigate()

    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
      }, [])
  return (
    <div className='Playlist'>
        <main>
            <Header openProfile={()=>setShowProfile(true)}/>
            <PlayListCover img={imgdef}/>
            <div className="playListContents">
                {!isLessThan500? <PlayListTypeTableHead head1='Name' head2='Author' head3='Duration' head4='Date' tabled4/>:null}
                <div className="playListTableContent">
                <MovieCardCustom onClick={()=> navigate('video?video_id=tate-no-yuusha-no-nariagari')}/>
                    <MovieCardCustom onClick={()=> navigate('video?video_id=tate-no-yuusha-no-nariagari')}/>
                    <MovieCardCustom onClick={()=> navigate('video?video_id=tate-no-yuusha-no-nariagari')}/>
                </div>
            </div>
        </main>

        {
                showProfile?
                    <Profile closeProfile={()=>setShowProfile(false)}/>
                :null
            } 
    </div>
  )
}

export default PlaylistSelected