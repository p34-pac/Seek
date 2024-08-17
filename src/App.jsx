/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, Suspense, useContext, useEffect, useState } from 'react'

import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './component/asset component/Loader/Loader';
import { ColorPalette, ComponentsPreview, ENoInternet, PlayedVideo, PlayedVideoTest, Playlist, RequestTest, Search, SelectedPlaylist } from './pages/All/All';
import { json, Route, Routes } from 'react-router-dom';
import { generateShades, parseColorsToCssVar } from './functions/colorgenerator';
import Home from './pages/Home/Home';
import Header from './component/Main Components/Header/Header';
import Profile from './component/Main Components/Profile/Profile';
import { getMoviesWithGenreNames, tmdbClient } from './functions/Requests/fetchApi';
import { BACKDROP_SIZE, generateArrayOfRandomNumbers, generateCollageSrc, getRandomValues, IMAGE_BASE_URL, updateUserProperty, userProfile } from './functions/Requests/actions';
import UserContextProvider, { UserContext } from './UserContext';
import Modal from './component/MinorComponents/Modal/Modal';
import { ArrowRightIcon } from './component/asset component/Icons/Icons';

export function setColor(){
  let primary = generateShades("#2E0245")
    let secondary = generateShades("#32263E")
    let baseWhite = generateShades("#F2F2F2")
    let baseBlack = generateShades("#2E2E2E")

    let templates = {primary, secondary, baseWhite, baseBlack}
    // parse colors
    parseColorsToCssVar(primary, "primary")
    parseColorsToCssVar(secondary, "secondary")
    parseColorsToCssVar(baseWhite, "baseWhite")
    parseColorsToCssVar(baseBlack, "baseBlack")
    return templates
}

// Custom hook to simulate delay
const useDelay = (delay) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [delay]);

  return isReady;
};

export async function getGenre(){
  const genres = await tmdbClient.fetchGenreAll()
  
  return genres
}
async function generateRandomGenre(genres, amount=6){
  let myGenres = getRandomValues(genres, amount)
  return myGenres
}

function GenreListing({ save, skip }) {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [pickedGenres, setPickedGenres] = useState([]);
  const [message, setMessage] = useState({ type: 'normal', message: '', return: false });

  useEffect(() => {
    async function getGs() {
      const genres = await tmdbClient.fetchGenreAll();
      const genresWithSrc = await Promise.all(genres.map(async genre => {
        const movieSrc = await tmdbClient.fetchSingleMovieByGenre(genre.id);
        return { ...genre, src: movieSrc };
      }));
      setAvailableGenres(genresWithSrc);
    }
    getGs();
  }, []);

  function pick(val) {
    if (pickedGenres.length < 6 && !pickedGenres.includes(val)) {
      setPickedGenres([...pickedGenres, val]);
      setMessage({ type: 'normal', message: '', return: false });
    } else {
      if (pickedGenres.length === 6 && !pickedGenres.includes(val)) {
        setTimeout(() => {
          setMessage({ type: 'error', message: 'You can only pick 6 genres', return: true });
        }, 10);
      }
      if (pickedGenres.includes(val)) {
        setPickedGenres(pickedGenres.filter(item => item.id !== val.id));
        setMessage({ type: 'normal', message: '', return: false });
      }
    }
  }

  function Item({ genre, selected }) {
    
    return (
      <span data-before={pickedGenres.find(i => i.name == genre.name)?pickedGenres.findIndex(i => i.name == genre.name)+1:null} onClick={() => pick(genre)} className={selected ? "genre picked" : "genre"}>
        <b>{genre.name}</b>
        {genre.src && <img src={ IMAGE_BASE_URL+BACKDROP_SIZE[BACKDROP_SIZE.length-1]+genre.src} alt={genre.name} />}
      </span>
    );
  }

  return (
    <>
      <Modal className='genreModal' defaultCancel={false}>
        <div className="top">
          {availableGenres.length > 0 ? <h1>Choose genres</h1> : null}
          {message.return ? <b className={`message ${message.type}`}>{message.message}</b> : null}
          <span className="skip"> <button onClick={() => skip()}>Skip <ArrowRightIcon fill="var(--primary100)" /></button> </span>
        </div>

        <div className="availableGenres">
          {availableGenres.length > 0
            ? availableGenres.map((genre, index) => (
              <Item key={index} genre={genre} selected={pickedGenres.includes(genre)} />
            ))
            : <Loader path="genres" />}
        </div>

        {pickedGenres.length > 0 ? <span className="save" ><button onClick={() => save(pickedGenres)}>Save</button></span> : null}
      </Modal>
    </>
  );
}




function App() {
  const isReady = useDelay(1000); // Delay for 1 seconds

  const [pageName, setPageName] = useState('');
  const [forYou, setForYou] = useState([])
  const [showGList, setShowGList] = useState(false)
  const {user, setUser} = useContext(UserContext)
  
  
  
  useEffect(() => {
    const getLastPathSegment = (pathname) => {
      const segments = pathname.split('/').filter(Boolean); // Split and filter empty segments
      const lastSegment = segments[segments.length - 1] || ''; // Get the last segment
      
      const words = lastSegment.split('-'); // Split by hyphens or spaces
      if (words.length > 5) {
        return words.slice(0, 5).join('-'); // Join the first 5 words with hyphens
      }
      return lastSegment;
    };

    setPageName(getLastPathSegment(window.location.pathname));
    
    

    // if(user){
    //   saveGenres()
    // }
  }, []);
  
    async function saveGenres(toSave=null){
      if(user.id){
        if(toSave){
          const updated = updateUserProperty(user, 'favoriteGenres', toSave)
          setUser(updated);
        }else{
          const allGeneres = await getGenre()
          const randomSave = await generateRandomGenre(allGeneres)
          const updated = updateUserProperty(user, 'favoriteGenres', randomSave)
          setUser(updated);
        }
      }
    }
  
  

  useEffect(() => {
    async function getForYou(genres){
      const generateForYou = await tmdbClient.fetchVariousGenreRecommendations(genres)
      setForYou(generateForYou);
      
    }
   if(user&&(user.favoriteGenres&&user.favoriteGenres.length>0)){
      getForYou(user.favoriteGenres)
   }else{
    setShowGList(true)
    
   }

        
  }, [user])
  

  

  const path = pageName!==""?pageName=="search"?"Searching":pageName:"Home";
  


  return (
    <>
    
    
    {isReady ? 
      user.favoriteGenres&&user.favoriteGenres.length>0?
        <Suspense fallback={<Loader path={path}/>}>
            <Routes>
                {/* main pages */}
                <Route path='/' element={<Home forYou={forYou}/>} />
                <Route path='/search' element={<Search/>} />
                <Route path='/collection' element={<SelectedPlaylist/>} />
                {/* <Route path='/collection/:playlist_name' element={<SelectedPlaylist/>} /> */}
                <Route path='/collection/:playlist_name/video' element={<PlayedVideo/>} />
                <Route path='/collection/video' element={<PlayedVideo/>} />
                <Route path='/video' element={<PlayedVideo/>} />


                {/* extra pages */}
                <Route path="/assets/colors" element={<ColorPalette templates={()=>setColor()} />} />
                <Route path="/assets/components" element={<ComponentsPreview />} />
                <Route path="/tests/requests" element={<RequestTest />} />
                <Route path='/tests/requests/played' element={<PlayedVideoTest/>} />
                <Route path='/no_internet' element={<ENoInternet/>} />
                <Route path='*' element={<div>{`"${path}"`} page not found</div>} />
            </Routes>
        </Suspense>
      :<GenreListing save={(val)=>saveGenres(val)} skip={()=>saveGenres()} />
       : 
       <Loader path={path}/>
             }
      
      




      <ToastContainer />
    </>
  )
}

export default App


  



