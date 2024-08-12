/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './VideoPlaying.css'
import { useLocation } from 'react-router-dom';
import Profile from '../../component/Main Components/Profile/Profile';
import Header from '../../component/Main Components/Header/Header';
import Back from '../../component/MinorComponents/Back/Back';
import VideoPlayer from '../../component/Main Components/VideoPlayer/VideoPlayer';
import VideoDescription from '../../component/Main Components/VideoDescription/VideoDescription';
import { tmdbClient } from '../../functions/Requests/fetchApi';
import { replaceSpecific } from '../../functions/Requests/actions';
import { VideoLoader } from '../../component/asset component/Loader/Loader';
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  

function VideoPlaying() {
    const [showProfile, setShowProfile] = useState(false)
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(false);
    
    const query = useQuery();
    const videoParam = query.get('title');
    // const videoId = query.get('title');

    
    useEffect(() => {
        // setVideoId(videoParam)
        async function loadMovie(){
            const loaded = await tmdbClient.searchMovies(decodeURIComponent(videoParam))
            setVideo(loaded[0]);
        }
        loadMovie()        
    }, [videoParam])

    useEffect(() => {
      
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
      }, 1000);
  }, [video])
    



  return (
    <div className='playing'>
      <main>
          <Header openProfile={()=>setShowProfile(true)} customLeft={<Back/>}/>
          {
            video?
              <>
                {
                  !loading?

                    <VideoPlayer videoInfo={video} />
                  
                  :<VideoLoader/>
                }
                <VideoDescription videoInfo={video}/>
              </>
            :null
          }

      </main>

      {
          showProfile?
              <Profile closeProfile={()=>setShowProfile(false)}/>
          :null
      }   
    </div>
  )
}

export default VideoPlaying