/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './RequestTest.css'
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
import {BACKDROP_SIZE, IMAGE_BASE_URL, replaceSpecific, tmdbAction, to_1_decimal} from '../../../functions/Requests/actions'
import {tmdbClient} from '../../../functions/Requests/fetchApi'
import { Outlet, useNavigate } from 'react-router-dom'
import { LoadingComponent } from '../Loader/Loader'
import { GenraMap3 } from '../../MinorComponents/GenreMap/GenreMap'

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



function RequestTest() {
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [recommendation, setRecommendation] = useState([])
    const likedGenres = ['action', 'adventure', 'comedy', 'family', 'anime', 'animation'];
    const navigate = useNavigate()

    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
        const loadData = async ()=>{
            let recommendations = await tmdbAction.getRecommendations(likedGenres)
            setRecommendation(recommendations)
        }
        loadData()
      }, [])
      useEffect(() => {
        console.log(recommendation);
      }, [recommendation])
      

  


      




  return (
    <div className='RequestTest'>
        <h1>Request Test</h1>

        {
            recommendation.length>0?
                recommendation.map((i, index)=>{
                    return <div key={index} className="genre">
                        <h1>{i.genre}</h1>
                        {
                            i.movies.map((m, index)=>{
                                return <MovieCard 
                                            key={index} 
                                            text1={m.title}
                                            text2={<GenraMap3 genreList={m.genre_names}/>}
                                            text3={m.release_date}
                                            imgSrc={m.poster_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+m.poster_path:IMAGE_BASE_URL+BACKDROP_SIZE[2]+m.poster_path}
                                            imgAlt={m.title}
                                            rating={to_1_decimal(m.vote_average)}
                                            onClick={()=>navigate(`played?title=${encodeURIComponent(m.title)}`)}
                                        />
                            })
                        }
                    </div>
                })
            :<>
                <LoadingComponent side='hr'/>
                <LoadingComponent side='hr'/>
                <LoadingComponent side='hr'/>
                <LoadingComponent side='hr'/>
                <LoadingComponent side='hr'/>
                <LoadingComponent side='hr'/>
            </>
        }
        
        <Outlet />

        

    </div>
  )
}

export default RequestTest