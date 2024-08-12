/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './VideoPlayer.css'
import RangePercent from '../../MinorComponents/Range/rangePercent'
import { BackwardIcon, ExpandIcon, ForwardIcon, NextIcon, PauseIcon, PlayIcon, PreviousIcon } from '../../asset component/Icons/Icons'
import classNames from 'classnames'
import video from '../../../assets/videos/2023-04-23 20-28-16.mp4'
import { tmdbClient } from '../../../functions/Requests/fetchApi'
import ReactPlayer from 'react-player'
import { AspectRatio } from '@chakra-ui/layout'
import YouTubePlayer from './YouPlayer'
import { VideoLoader } from '../../asset component/Loader/Loader'

function VideoPlayer({videoInfo}) {
    const [videos, setVideos] = useState([]);
    const [videosOthers, setVideosOthers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [hovered, setHovered] = useState(false)
    const VideoPlayerClass = classNames('VideoPlayer', {hovered})
    const [fullscreen, setFullscreen] = useState(false);

    const [volume, setVolume] = useState(1); // Volume range from 0 to 1
    const [volumeInPercent, setVolumeInPercent] = useState(1); // Volume range from 0 to 1
    const videoRef = useRef(null);
    const isDragging = useRef(false);
    const startVolume = useRef(volume);
    const container = useRef(null);


    
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging.current) {
        const { clientY } = event; // Use clientY for vertical dragging
        const { top, height } = videoRef.current.getBoundingClientRect();
        const offset = (clientY - top) / height; // Calculate the offset from the start of the container
        const newVolume = Math.max(0, Math.min(1, startVolume.current - offset)); // Adjust volume based on offset
        setVolume(newVolume);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (event) => {
      isDragging.current = true;
      startVolume.current = volume; // Record the current volume as the starting point
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const videoElement = videoRef.current;
    // videoElement.addEventListener('mousedown', handleMouseDown);

    return () => {
      // videoElement.removeEventListener('mousedown', handleMouseDown);
    };
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);
  const fetchTrailers = async () => {
    if (!videoInfo.id) return;
    setLoading(true);
    setError('');
    
    try {
        const results = await tmdbClient.getMovieVideos(videoInfo.id);
        // Filter for trailers only (type "Trailer")
        const trailers = results.filter(video => video.type === 'Trailer');
        const Teaser = results.filter(video => video.type == 'Trailer');
        setVideos(trailers);
        setVideosOthers(Teaser);
    } catch (error) {
        setError('Error fetching movie trailers');
    } finally {
        setLoading(false);
    }
};
  useEffect(() => {
    fetchTrailers()
  }, [videoInfo]);





    function toggleHovered(){
        if(hovered){
            setHovered(false)
        }else{
            setHovered(true)
        }
    }

    const toggleFullscreen = () => {
      if (container.current) {
          if (document.fullscreenElement) {
              document.exitFullscreen().catch((err) => {
                  console.error(`Failed to exit fullscreen mode: ${err.message}`);
                  return
              });
              setFullscreen(false)
          } else if (container.current.requestFullscreen) {
              container.current.requestFullscreen().catch((err) => {
                  console.error(`Failed to enter fullscreen mode: ${err.message}`);
                  return
              });
              setFullscreen(true)

              

          } else {
              console.error('Fullscreen API is not supported');
          }
      } else {
          console.error('container.current is not connected');
      }
  };
    
    


  return (
    <div className={VideoPlayerClass}>
        <div className="videoBox" ref={container}>
          {
            !loading?
              videos&&videos.length>0?
                <YouTubePlayer isfullscreen={fullscreen} fullscreenToggle={toggleFullscreen} videos={videos} videoId={videos[0].key} />
              :<VideoLoader/>
            :<VideoLoader/>
          }
        </div>
        
    </div>
  )
}

export default VideoPlayer