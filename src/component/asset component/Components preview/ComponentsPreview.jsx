/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './ComponentsPreview.css'
import Header from '../../Main Components/Header/Header'
import OtherOptions from '../../MinorComponents/OtherOptions/OtherOptions'
import MovieCard from '../../Main Components/MovieCard/MovieCard'
import ActionWithIcon from '../../MinorComponents/ActionWithIcon/ActionWithIcon'
import { DownloadIcon } from '../Icons/Icons'
import Carousel from '../../Main Components/Carousel/Carousel'


import img1 from '../../../assets/images/Bad Boys - Harte Jungs (Blu-ray) 1.png'
import img2 from '../../../assets/images/Die Bad Boys nehmen euch auf einen weiteren _Ride_… 1.png'
import img3 from '../../../assets/images/John Wick 1.png'
import img4 from '../../../assets/images/Trends International Naruto Shippuden - Group Wall Poster, 22_375_ x 34_, Unframed Version 1.png'
import UserDp from '../../MinorComponents/UserDp/UserDp'
import Collection from '../../MinorComponents/Collection/Collection'
import Profile from '../../Main Components/Profile/Profile'
import PlayListCover from '../../MinorComponents/PlayListCover/PlayListCover'
import PlayListTypeTableHead from '../../MinorComponents/PlayListTypeTableHead/PlayListTypeTableHead'
import VideoPlayer from '../../Main Components/VideoPlayer/VideoPlayer'
import { CastCrewsCard } from '../../MinorComponents/MovieCardCustom/MovieCardCustom'
import VideoDescription from '../../Main Components/VideoDescription/VideoDescription'

export const images = [
    {
        desc: "",
        src: img1
    },
    {
        desc: "",
        src: img2
    },
    {
        desc: "",
        src: img3
    },
    {
        desc: "",
        src: img4
    }
]



function ComponentsPreview() {
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
      }, [])
  return (
    <div className='ComponentsPreview'>
        <h1>Components Preview</h1>

        <h1>Header (click on the circle at the end to open profile)</h1>

        <Header openProfile={()=>setShowProfile(true)}/>
        {
                showProfile?
                    <Profile closeProfile={()=>setShowProfile(false)}/>
                :null
            } 
        <h1>Options</h1>
        <OtherOptions>
            <ActionWithIcon icon={<DownloadIcon/>}>Download</ActionWithIcon>
            <ActionWithIcon >save</ActionWithIcon>
        </OtherOptions>

        <h1>Carousel</h1>
        <Carousel images={images}/>

        <h1>Movie cards</h1>

        <b>Normal</b>
        <MovieCard />

        <b>Small Vertical Card</b>
        <MovieCard verticalAlign={true} />


        <b>Cast/crew type card</b>
        <CastCrewsCard person="Keanu reeves" position={"John wick"}/>

        <b>With option button at right</b>
        <MovieCard optionDropOnRight={true} />

        <b>With option button at right and shrinked</b>
        <MovieCard optionDropOnRight={true} shrink={true} />

        <b>No option btn shrinked</b>
        <MovieCard  optionDrop={false} shrink={true}  />

        <h1>User Display image and name</h1>
        <UserDp/>
        <h1>Collection Box</h1>
        <Collection/>

        <h1>Table elements/Playlist content cards</h1>
        <PlayListTypeTableHead/>
        {
            isLessThan500?
            <>
                <b>Table card if width is less than or is 500px</b>
                <MovieCard  optionDrop={false} before={false} shrink />
            </>
            :
            <>
                <b>Table options 3 (contents will fill odd if card is evenly placed and reverse)</b>
                <MovieCard  optionDrop={false} tabled3 before={false} />
                <MovieCard  optionDropOnRight tabled3 before={false} />
                
                
                <b>Table options 4 (contents will fill odd if card is evenly placed and reverse)</b>
                <MovieCard  optionDrop={false} tabled4 before={false}  />
                <MovieCard  optionDropOnRight tabled4 before={false}  /> 
            </>

        }
        <h1>Playlist cover</h1>
        <PlayListCover img={images[3].src}/>

        <br /><br />

        <h1>Video Player</h1>
        <VideoPlayer/>

        <br /><br />
        <h1>Video Description</h1>
        <VideoDescription/>

        

    </div>
  )
}

export default ComponentsPreview