/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import './Playlist.css'
import Header from '../../component/Main Components/Header/Header'
import Profile from '../../component/Main Components/Profile/Profile'
import PlayListCover from '../../component/MinorComponents/PlayListCover/PlayListCover'
import PlayListTypeTableHead from '../../component/MinorComponents/PlayListTypeTableHead/PlayListTypeTableHead'
import MovieCard from '../../component/Main Components/MovieCard/MovieCard'
import MovieCardCustom from '../../component/MinorComponents/MovieCardCustom/MovieCardCustom'
import imgdef from "../../assets/images/Trends International Naruto Shippuden - Group Wall Poster, 22_375_ x 34_, Unframed Version 1.png"
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '../Search/Search'
import { UserContext } from '../../UserContext'
import { GenraMap3 } from '../../component/MinorComponents/GenreMap/GenreMap'
import { BACKDROP_SIZE, IMAGE_BASE_URL } from '../../functions/Requests/actions'
import { ImageLoader } from '../../component/asset component/Loader/Loader'

function PlaylistSelected() {
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [hoverMovieCard, setHoverMovieCard] = useState(false)
    const [foundCollection, setFoundCollection] = useState(null)
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const query = useQuery();
    const collectionName = query.get('collectionName');
    const location = useLocation()

    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
        console.log(collectionName);
        
      }, [])
      useEffect(() => {
        if(user&&collectionName){
            const collection = user.userCollections.find(collection => collection.name === collectionName)
            console.log(collection);
            if(collection){
                setFoundCollection(collection);
            }else{
                navigate(-1);
            }
            
        }

      }, [user, collectionName])


  return (
    <div className='Playlist'>
        <main>
            <Header openProfile={()=>setShowProfile(true)}/>
            <PlayListCover img={foundCollection&&foundCollection.collectionThumbnail?foundCollection.collectionThumbnail:<ImageLoader />}/>
            <div className="playListContents">
                {!isLessThan500? <PlayListTypeTableHead head1='Name' head2='Author' head3='Date' head4='Date' tabled3/>:null}
                <div className="playListTableContent">
                    
                    {
                        foundCollection?foundCollection.items.map(i => (
                            <MovieCardCustom key={i.id}
                                texts={{text1:i.title, text2:<GenraMap3 genreList={i.genres} />, text3:i.release_date}}
                                imgSrc={i.poster_path?IMAGE_BASE_URL+BACKDROP_SIZE[BACKDROP_SIZE.length-1]+i.poster_path:IMAGE_BASE_URL+BACKDROP_SIZE[BACKDROP_SIZE.length-1]+i.backdrop_path}
                                onClick={()=> navigate(`video?title=${i.title}`)}
                            />
                        ))
                        :null
                    }
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