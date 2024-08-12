/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import YouTubePlayerManager from '../../../functions/Requests/ytApi';
import RangePercent from '../../MinorComponents/Range/rangePercent';
import { BackwardIcon, ExpandIcon, ForwardIcon, NextIcon, PauseIcon, PlayIcon, PreviousIcon } from '../../asset component/Icons/Icons';
import { convertTimeToPercentage } from '../../../functions/Requests/actions';
import { VideoLoader } from '../../asset component/Loader/Loader';

const YouTubePlayer = ({ videoId, videos, fullscreenToggle, isfullscreen }) => {
    const playerRef = useRef(null);
    const [playerManager, setPlayerManager] = useState(null);
    const [played, setPlayed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [duration, setDuration] = useState(0);
    const [total, setTotalDuration] = useState(0);
    const [current, setCurrent] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    

    useEffect(() => {
        if(playerManager){
            setTimeout(() => {
                setVideoLoaded(true)
                playerManager.loadYouTubeAPI()
            }, 2000);
        }else{
            setVideoLoaded(false)
            
        }
    }, [playerManager]); 
    const onPlayerReady = () => {
        console.log('Player is ready');
    };
    // Initialize the player
    useEffect(() => {
        setLoading(true)
        if (playerRef.current) {
            const manager = new YouTubePlayerManager(playerRef.current.id, videoId, onPlayerReady);
                setPlayerManager(manager);
        }
    }, [videoId]); // Reinitialize player when videoId changes

    // Update current time and duration
    useEffect(() => {
        if (playerManager && played) {
            const updateTime = () => {
                try {
                    const { currentTime, duration } = playerManager.getCurrentTimeAndDuration() || {};
                    if (currentTime !== undefined && duration !== undefined) {
                        setCurrent(currentTime);
                        setTotalDuration(duration);
                    }
                } catch (error) {
                    console.error('Error fetching time and duration:', error);
                }
            };

            // Update time every second
            const interval = setInterval(updateTime, 1000);

            return () => clearInterval(interval);
        }
    }, [playerManager, played]);

    // // Seek to percentage
    useEffect(() => {
        if (playerManager) {
            playerManager.seekToPercentage(convertTimeToPercentage(duration, total));
        }
    }, [duration, total]);

    // // Seek to percentage
    

    // Play or pause the video
    const handlePlay = () => {
        if (playerManager) {
            if (played) {
                playerManager.pause();
                setPlayed(false);
            } else {
                playerManager.play();
                setPlayed(true);
            }
        }
    };

    const handleSeek = (seconds) => {
        if (playerManager) {
            const newTime = Math.max(0, Math.min(total, current + seconds));
            playerManager.seek(newTime);
            setCurrent(newTime);
        }
    };

    const toggleHovered = () => {
        setHovered(!hovered);
    };


    

   

    const durationPercentage = convertTimeToPercentage(current, total);

    return (
        <>
            <div ref={playerRef} id="youtube-player">
                
            </div>
            {
                    !videoLoaded||!playerManager?<VideoLoader/>
                    :<div className='divOverlay' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={toggleHovered}>
                        {hovered &&
                            <>
                                <div className="controls">
                                    <span><PreviousIcon fill='var(--baseWhite1000)' /></span>
                                    <span onClick={() => handleSeek(-10)}><BackwardIcon fill='var(--baseWhite1000)' /></span>
                                    <span onClick={handlePlay} className='PlayPause'>
                                        {!played ? <PlayIcon fill='var(--baseWhite1000)' /> : <PauseIcon opacity={1} fill='var(--baseWhite1000)' />}
                                    </span>
                                    <span onClick={() => handleSeek(10)}><ForwardIcon fill='var(--baseWhite1000)' /></span>
                                    <span><NextIcon fill='var(--baseWhite1000)' /></span>
                                </div>
                                <div className="lower">
                                    <div className="timing">
                                    <div className="current_to_total">
                                        <span>{Math.floor(current / 60)}:{('0' + Math.floor(current % 60)).slice(-2)}</span> / 
                                        <span>{Math.floor(total / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}</span>
                                    </div>
                                        <RangePercent value={durationPercentage} setValue={(val) => setDuration(val * total / 100)}  />
                                    </div>
                                    <div className="extra">
                                        <span className="sizing" onClick={fullscreenToggle}>
                                            <ExpandIcon fill='var(--baseWhite1000)' />
                                        </span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                }
            
        </>
    );
};

export default YouTubePlayer;
