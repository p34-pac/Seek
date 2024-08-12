/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './BottomControl.css'
import Volume from '../Volume/Volume'
import VolumeMin from './volumeMin'
import VolumeMute from './volumeMute'
import VolumeMax from './volumeMax'
import RangePercent from '../Range/rangePercent'
// import music from '../../assets/Alan_Walker_Alone_(thinkNews.com.ng).mp3'
import { useRef } from 'react'
import LessThan600 from '../LessThan600/LessThan600'
import ModalSection from '../Modal/ModalSection'
import { PlayFillIcon } from '../../asset component/Icons/Icons'

function BottomControl() {
    const [volume, setVolume] = useState( 10 )
    const [muted, setMuted] = useState(false)
    const [prev, setPrev] = useState(10)
    const [onRepeat, setOnRepeat] = useState(false)
    const [onRepeatSingle, setOnRepeatSingle] = useState(false)
    const [onShuffle, setOnShuffle] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(null)
    const [totalTime, setTotalTIme] = useState(null)
    const [ playProgress, setPlayProgress ] = useState(10)
    const [liked, setLiked] = useState(false)
    const [showVolume, setShowVolume] = useState(false)
    const audioRef = useRef(null);
    const timeOut = setTimeout(() => {
        setShowVolume(false)
    }, 3000);

    function rem(){
        setTimeout(() => {
            setShowVolume(false)
        }, 3000);
    }
    

    function getCurrentPlaybackPercent(audio) {
        const currentTime = audio.currentTime;
        const totalDuration = audio.duration;
      
        if (totalDuration === 0) {
          return 0; // If duration is not available yet
        } else {
          return (currentTime / totalDuration) * 100;
        }
      }
    function percentToSeconds(to, audio) {
        const totalDuration = audio.duration;
        return (to / 100) * totalDuration;
    }



    function SetRepeat(){
        if(onRepeat){
            setOnRepeat(false)
            setOnRepeatSingle(true)
        }else if(!onRepeat &&  onRepeatSingle){
            setOnRepeatSingle(false)
        }else if(!onRepeat &&  !onRepeatSingle){
            setOnRepeat(true)
        }
    }
    function SetShuffle(){
        if(onShuffle){
            setOnShuffle(false)
        }else if(!onShuffle){
            setOnShuffle(true)
        }
    }
    function setToPlaying(){
        const audio = audioRef.current;
        if(playing){
            audio.pause()
            setPlaying(false)
        }else if(!playing){
            audio.play()
            setPlaying(true)
        }
    }
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${Math.floor(minutes)}:${Math.floor(remainingSeconds) < 10 ? '0' : ''}${Math.floor(remainingSeconds)}`;
    }

    function favorite(){
        if(liked){
            setLiked(false)
        }else if(!liked){
            setLiked(true)
        }
    }
    function fullScreen(){
        const rootElement = document.documentElement;
        if (document.fullscreenElement) {
            exitFullscreen();
          } else {
            enterFullscreen(rootElement);
          }
    }
    function enterFullscreen(rootElement){

        if (rootElement.requestFullscreen) {
          rootElement.requestFullscreen();
        } else if (rootElement.mozRequestFullScreen) { /* Firefox */
          rootElement.mozRequestFullScreen();
        } else if (rootElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          rootElement.webkitRequestFullscreen();
        } else if (rootElement.msRequestFullscreen) { /* IE/Edge */
          rootElement.msRequestFullscreen();
        }

    }
      
function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }


    useEffect(() => {
        const audio = audioRef.current;
        
        let playTimeCurrent = formatTime(audio.currentTime)
        setCurrentTime(playTimeCurrent)
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            let playTimeTotal = formatTime(duration)
            setTotalTIme(playTimeTotal)

            let timePos = Math.floor(getCurrentPlaybackPercent(audio))
            let secs = Math.floor(audio.currentTime)
            setPlayProgress(timePos)
        });


        const updateCurrentTime = () => {
            let timePos = Math.floor(getCurrentPlaybackPercent(audio))
            let secs = Math.floor(audio.currentTime)
            setPlayProgress(timePos)
            
        };
    
        audio.addEventListener('timeupdate', updateCurrentTime);
    
        return () => {
          audio.removeEventListener('timeupdate', updateCurrentTime);
        };
        
      }, []);
        



    useEffect(() => {
        if(muted){
            setPrev(volume)
            setVolume(0)
        }else if(!muted){
            setVolume(prev)
        }
    }, [muted])
    useEffect(() => {
        const audio = audioRef.current;
        if(volume > 0){
            setMuted(false)
        }
        audio.volume = volume/100

    }, [volume])
    useEffect(() => {
        const audio = audioRef.current;
        let timePos = Math.floor(getCurrentPlaybackPercent(audio))

        try {
            if(playProgress !== timePos){
                audio.currentTime = percentToSeconds(playProgress, audio)
            }
            let playTimeCurrent = formatTime(audio.currentTime)
            let playTimeTotal = formatTime(audio.duration)
            setCurrentTime(playTimeCurrent)
            setTotalTIme(playTimeTotal)
        } catch (error) {
            return
        }

    }, [playProgress])

    function makeShowVolume(){
        if(showVolume){
            setShowVolume(false)
        }else if(!showVolume){
            setShowVolume(true)
            
        }
        
    }
    
    function ShowDeviceModal(classN){
        
        let modal = document.querySelector(`.${classN}`)
            
            if(modal.classList.contains("shown")){
                modal.classList.remove("shown")
                modal.classList.add("shown")
            }else{
                modal.classList.add("shown")

            }
            try {
                modal.classList.remove("not-shown")
            } catch (error) {
                return
            }
    }
    
  return (
    
    <>
    <div className='BottomControl'>
        <div className="mediaPlayedVis">
            <div className="thumbnailVisSHow"></div>
            <div className="audioContext">
                <b className="audioName">Thank You</b>
                <b className="audioArtistList">meno, someone</b>
            </div>
            <i className='ICN-like' onClick={favorite}>
                {
                    liked == false?<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                <path d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z" fill="var(--primary-text)"/>
                            </svg>
                            :<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="green"/>
                            </svg>
                }
            </i>
        </div>
        <div className="playControls">
            <ul className="playControl">
                <li className={onShuffle?"shuffle shuffleOn": "shuffle"} onClick={SetShuffle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path d="M17.448 2.03362C17.8385 1.64315 18.4716 1.64302 18.8621 2.0334L21.4146 4.58483C22.1959 5.36584 22.1961 6.63239 21.4149 7.41355L18.8675 9.96094C18.477 10.3515 17.8438 10.3515 17.4533 9.96094C17.0628 9.57042 17.0628 8.93725 17.4533 8.54673L19 7H14.2361C13.8573 7 13.511 7.214 13.3416 7.55279L11.8954 10.4452L10.7699 8.22417L11.5528 6.65836C12.061 5.64201 13.0998 5 14.2361 5H19L17.4479 3.44791C17.0574 3.05738 17.0575 2.42415 17.448 2.03362Z" fill="#0F0F0F"/>
                        <path d="M17.448 14.0336C17.8385 13.6432 18.4716 13.643 18.8621 14.0334L21.4146 16.5848C22.1959 17.3658 22.1961 18.6324 21.4149 19.4136L18.8675 21.9609C18.477 22.3515 17.8438 22.3515 17.4533 21.9609C17.0628 21.5704 17.0628 20.9373 17.4533 20.5467L19 19H14.2361C13.0998 19 12.061 18.358 11.5528 17.3416L6.65836 7.55279C6.48897 7.214 6.1427 7 5.76393 7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H5.76393C6.90025 5 7.93904 5.64201 8.44721 6.65836L13.3416 16.4472C13.511 16.786 13.8573 17 14.2361 17H19L17.4479 15.4479C17.0574 15.0574 17.0575 14.4241 17.448 14.0336Z" fill="#0F0F0F"/>
                        <path d="M8.12308 13.5178L9.24864 15.7388L8.44721 17.3416C7.93904 18.358 6.90025 19 5.76393 19H3C2.44772 19 2 18.5523 2 18C2 17.4477 2.44772 17 3 17H5.76393C6.1427 17 6.48897 16.786 6.65836 16.4472L8.12308 13.5178Z" fill="#0F0F0F"/>
                    </svg>
                </li>
                <li className="previous">
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5.8A1.8 1.8 0 0 1 4.8 4h1.4A1.8 1.8 0 0 1 8 5.8v12.4A1.8 1.8 0 0 1 6.2 20H4.8A1.8 1.8 0 0 1 3 18.2V5.8ZM21.462 4.113A1 1 0 0 1 22 5v14a1 1 0 0 1-1.573.82l-10-7a1 1 0 0 1 0-1.64l10-7a1 1 0 0 1 1.035-.067Z" fill="#000000"/>
                    </svg>
                </li>
                <li className="play" onClick={setToPlaying}>
                    {
                        playing? <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1">
                                    <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"/>
                                </svg>
                                : <PlayFillIcon/>
                    }
                </li>
                <li className="next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.538 4.113a1 1 0 0 1 1.035.068l10 7a1 1 0 0 1 0 1.638l-10 7A1 1 0 0 1 2 19V5a1 1 0 0 1 .538-.887ZM16 5.8A1.8 1.8 0 0 1 17.8 4h1.4A1.8 1.8 0 0 1 21 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8h-1.4a1.8 1.8 0 0 1-1.8-1.8V5.8Z" fill="#000000"/>
                    </svg>
                </li>
                <li className={onRepeat?"repeat repeatOn":onRepeatSingle? "repeat repeatSingleOn": "repeat"} onClick={SetRepeat}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path d="M5.00001 4C3.34315 4 2.00001 5.34314 2.00001 7L2 17C2 18.6569 3.34315 20 5 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H5C4.44771 18 4 17.5523 4 17V7C4 6.44772 4.44771 6 5 6L19 6C19.5523 6 20 6.44772 20 7L20 17C20 17.5523 19.5523 18 19 18H14.0027L15.2821 16.7161C15.6734 16.3235 15.6734 15.687 15.2821 15.2944C14.8909 14.9019 14.2566 14.9019 13.8654 15.2944L11.5937 17.574L11.5805 17.5873C10.804 18.3724 10.8057 19.6406 11.5859 20.4234L13.8604 22.7058C14.2513 23.0981 14.8852 23.0981 15.2762 22.7058C15.6672 22.3134 15.6672 21.6773 15.2762 21.285L13.9956 20H19C20.6569 20 22 18.6569 22 17L22 7C22 5.34315 20.6569 4 19 4L5.00001 4Z" fill="#0F0F0F"/>
                    </svg>
                </li>
            </ul>
            <ul className="soundTime">
                    <li className="currentTime">{currentTime? currentTime: "-:--"}</li>
                    <li className='musicProgress'>
                    <audio id="myAudio" ref={audioRef} controls loop={onRepeatSingle?true:false}>
                        <source src=" " type="audio/mpeg" />
                    </audio>
                        <RangePercent
                            value={playProgress}
                            setValue={(value) => {
                                setPlayProgress(value)
                            }}
                        />
                    </li>
                    <li className="totalTime">{totalTime? totalTime: "-:--"}</li>
            </ul>
        </div>
        <div className="soundControl">
            <ul className="controls">
                <li className="queue">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24">
                        <path d="M22,4H2A1,1,0,0,0,1,5v6a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V5A1,1,0,0,0,22,4Zm-1,6H3V6H21Zm2,5a1,1,0,0,1-1,1H2a1,1,0,0,1,0-2H22A1,1,0,0,1,23,15Zm0,4a1,1,0,0,1-1,1H2a1,1,0,0,1,0-2H22A1,1,0,0,1,23,19Z"/>
                    </svg>
                </li>
                <li className="connect" onClick={()=>ShowDeviceModal("devicesModal")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path d="M17.0099 12.73C17.6009 12.73 18.0799 12.251 18.0799 11.66C18.0799 11.0691 17.6009 10.5901 17.0099 10.5901C16.419 10.5901 15.9399 11.0691 15.9399 11.66C15.9399 12.251 16.419 12.73 17.0099 12.73Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 6V7.78998C19.75 7.75998 19.46 7.73999 19.15 7.73999H14.87C12.73 7.73999 12.02 8.45003 12.02 10.59V15.7H6C2.8 15.7 2 14.9 2 11.7V6C2 2.8 2.8 2 6 2H16C19.2 2 20 2.8 20 6Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 15.7V19.9999" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 11.9H12" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.94995 20H11.9999" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.0099 12.73C17.6009 12.73 18.0799 12.251 18.0799 11.66C18.0799 11.0691 17.6009 10.5901 17.0099 10.5901C16.419 10.5901 15.9399 11.0691 15.9399 11.66C15.9399 12.251 16.419 12.73 17.0099 12.73Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 7.78998C19.75 7.75998 19.46 7.73999 19.15 7.73999H14.87C12.73 7.73999 12.02 8.45003 12.02 10.59V19.15C12.02 21.29 12.73 22 14.87 22H19.15C21.29 22 22 21.29 22 19.15V10.59C22 8.76003 21.48 7.97998 20 7.78998ZM17.01 10.59C17.6 10.59 18.08 11.07 18.08 11.66C18.08 12.25 17.6 12.73 17.01 12.73C16.42 12.73 15.94 12.25 15.94 11.66C15.94 11.07 16.42 10.59 17.01 10.59ZM17.01 19.15C15.83 19.15 14.87 18.19 14.87 17.01C14.87 16.52 15.04 16.06 15.32 15.7C15.71 15.2 16.32 14.87 17.01 14.87C17.55 14.87 18.04 15.07 18.41 15.39C18.86 15.79 19.15 16.37 19.15 17.01C19.15 18.19 18.19 19.15 17.01 19.15Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.1501 17.01C19.1501 18.19 18.1901 19.15 17.0101 19.15C15.8301 19.15 14.8701 18.19 14.8701 17.01C14.8701 16.52 15.0401 16.06 15.3201 15.7C15.7101 15.2 16.3201 14.87 17.0101 14.87C17.5501 14.87 18.0401 15.07 18.4101 15.39C18.8601 15.79 19.1501 16.37 19.1501 17.01Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.0099 12.73C17.6009 12.73 18.0799 12.251 18.0799 11.66C18.0799 11.0691 17.6009 10.5901 17.0099 10.5901C16.419 10.5901 15.9399 11.0691 15.9399 11.66C15.9399 12.251 16.419 12.73 17.0099 12.73Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </li>
                <li className="volume">
                        <button className='muteBtn' onClick={()=>{
                            muted ? setMuted(false): setMuted(true);
                        }}>
                            {muted ? <VolumeMute /> 
                            :volume < 1&&!muted ? <VolumeMute /> 
                            : volume <= 30&&!muted ? <VolumeMin /> 
                            : volume > 30&&!muted ? <VolumeMax />
                            : null 
                            }
                        </button>
                        <button onClick={makeShowVolume} className='forMin'>
                            {muted ? <VolumeMute /> 
                                :volume < 1&&!muted ? <VolumeMute /> 
                                : volume <= 30&&!muted ? <VolumeMin /> 
                                : volume > 30&&!muted ? <VolumeMax />
                                : null 
                            }
                        </button>
                        <title>{volume}</title>
                    <div className={showVolume? "volumeCont shown": "volumeCont"} autoFocus onMouseEnter={clearTimeout(timeOut)} onMouseLeave={rem} onFocus={()=>setShowVolume(true)}>
                    <button onClick={()=>{
                            muted ? setMuted(false): setMuted(true);
                        }}>
                            {muted ? <VolumeMute /> 
                            :volume < 1&&!muted ? <VolumeMute /> 
                            : volume <= 30&&!muted ? <VolumeMin /> 
                            : volume > 30&&!muted ? <VolumeMax />
                            : null 
                            }
                        </button>
                        <Volume
                            volume={volume}
                            setVolume={(value) => {
                                setVolume(value)
                            }}
                        />
                    </div>
                </li>
                <li className="fullscreen" onClick={fullScreen}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true">
                        <path d="M 12.851703,1.14844 C 12.752843,1.04944 12.635563,1 12.500164,1 L 9.0001119,1 c -0.135399,0 -0.252483,0.0495 -0.35154,0.14844 -0.09886,0.099 -0.148344,0.21614 -0.148344,0.35154 0,0.1354 0.04948,0.25268 0.148344,0.35154 l 1.124908,1.125 -2.593779,2.59378 c -0.05207,0.0522 -0.07815,0.112 -0.07815,0.1797 0,0.0677 0.02608,0.12763 0.07815,0.1797 l 0.890644,0.89065 c 0.05207,0.0521 0.111905,0.0781 0.179701,0.0781 0.0677,0 0.127536,-0.026 0.179605,-0.0781 l 2.5938751,-2.59378 1.124811,1.12491 c 0.09906,0.099 0.216332,0.14853 0.351731,0.14853 0.135399,0 0.252579,-0.0496 0.351539,-0.14853 0.09887,-0.0989 0.148345,-0.21614 0.148345,-0.35154 l 0,-3.50006 c 9.6e-5,-0.13549 -0.0491,-0.25248 -0.148249,-0.35144 z M 5.9298469,7.17956 c -0.05207,-0.0521 -0.112001,-0.0781 -0.179701,-0.0781 -0.0677,0 -0.127632,0.026 -0.179701,0.0781 l -2.593779,2.59378 -1.125003,-1.1251 c -0.09896,-0.0988 -0.216044,-0.14835 -0.351539,-0.14835 -0.135495,0 -0.252675,0.0496 -0.351635,0.14835 -0.09896,0.099 -0.148441,0.21633 -0.148441,0.35173 l 0,3.50005 c 0,0.1354 0.04948,0.25258 0.148441,0.35154 C 1.2475489,12.95046 1.3647249,13 1.5001239,13 l 3.500052,0 c 0.135399,0 0.252579,-0.0496 0.351539,-0.14844 0.09896,-0.099 0.148441,-0.21614 0.148441,-0.35154 0,-0.1354 -0.04948,-0.25268 -0.148441,-0.35173 L 4.2267119,11.02348 6.8204909,8.4296 c 0.05207,-0.0521 0.07805,-0.1119 0.07805,-0.1797 0,-0.0677 -0.02608,-0.12753 -0.07805,-0.1797 L 5.9298469,7.17956 Z"/>
                    </svg>
                </li>
            </ul>
        </div>
    </div>
    <LessThan600 
        play={<PlayFillIcon/>} 
        playing={playing} 
        setToPlaying={setToPlaying}
        SetRepeat={SetRepeat}
        SetShuffle={SetShuffle}
        currentTime={currentTime}
        onRepeat={onRepeat}
        onRepeatSingle={onRepeatSingle}
        onShuffle={onShuffle}
        playProgress={playProgress}
        setPlayProgress={(value) => setPlayProgress(value)}
        totalTime={totalTime}
        onClickDevice={()=>ShowDeviceModal("devicesModal")}
    />

    <ModalSection classname="devicesModal">
        <div className="dragDown"></div>
        <div className="playedOn">
            <div className="device">
                <i className="icn-dev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z" fill="#000000"/>
                    </svg>
                </i>
                <div className="deviceTxt">
                    <h3>Current Device</h3>
                    <b className="deviceName">This Computer</b>
                </div>
            </div>
            <div className="otherDevices">
                <b className="notFound">No other device found!</b>
            </div>
        </div>
    </ModalSection>
    </>
  )
}

export default BottomControl