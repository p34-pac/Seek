/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Suspense, useEffect, useState } from 'react'

import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './component/asset component/Loader/Loader';
import { ColorPalette, ComponentsPreview, PlayedVideo, PlayedVideoTest, Playlist, RequestTest, Search, SelectedPlaylist } from './pages/All/All';
import { json, Route, Routes } from 'react-router-dom';
import { generateShades, parseColorsToCssVar } from './functions/colorgenerator';
import Home from './pages/Home/Home';
import Header from './component/Main Components/Header/Header';
import Profile from './component/Main Components/Profile/Profile';
import { tmdbClient } from './functions/Requests/fetchApi';
import { generateArrayOfRandomNumbers, generateCollageSrc, getRandomValues, updateUserProperty, userProfile } from './functions/Requests/actions';

function setColor(){
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
async function saveGenres(userProf){
  console.log(userProf);

  const allGeneres = await getGenre()
  const toSave = await generateRandomGenre(allGeneres)

  const updated = await updateUserProperty(userProf, 'favoriteGenres', toSave)
  
  userProfile.setToStorage(updated)
}



function App({def}) {
  const isReady = useDelay(1000); // Delay for 1 seconds

  const [pageName, setPageName] = useState('');
  const [forYou, setForYou] = useState([])
  const [user, setUser] = useState(null)
  
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
    setColor()
    
    async function getUserProfile() {
      const user = await userProfile.getFromStorage(def).then(res => JSON.parse(res) )
      setUser(user);
    }
    
    setTimeout(async() => {
      await getUserProfile()
    }, 100);
    
    
  }, []);
  async function generateImageForAllCollection() {
    if(user){
      const collection = user.userCollections;
      collection.map(async i => {
        if(i.items.length <= 4 || i.collectionThumbnail == 'https://via.placeholder.com/150'){
          const src = await generateCollageSrc(i.items)
          i.collectionThumbnail = src          
        }
      })
      
    }
  }

  useEffect(() => {

    async function getGenreSuggestion(){
      const userGenres = user.favoriteGenres      
      let recommend = await tmdbClient.fetchVariousGenreRecommendations(userGenres)
      setForYou(recommend);
    }

    if(user){
      saveGenres(user);
      generateImageForAllCollection()
      setTimeout(async() => {
        await getGenreSuggestion()
      }, 2000);
    }
  }, [user])
  

  const path = pageName!==""?pageName=="search"?"Searching":pageName:"Home";
  


  return (
    <>
    
    
    {isReady ? 
    <Suspense fallback={<Loader path={path}/>}>
    
        <Routes>
            {/* main pages */}
            <Route path='/' element={<Home forYou={forYou}/>} />
            <Route path='/search' element={<Search/>} />
            <Route path='/playlists' element={<Playlist/>} />
            <Route path='/playlists/:playlist_name' element={<SelectedPlaylist/>} />
            <Route path='/playlists/:playlist_name/video' element={<PlayedVideo/>} />
            <Route path='/playlists/video' element={<PlayedVideo/>} />
            <Route path='/video' element={<PlayedVideo/>} />


            {/* extra pages */}
            <Route path="/assets/colors" element={<ColorPalette templates={()=>setColor()} />} />
            <Route path="/assets/components" element={<ComponentsPreview />} />
            <Route path="/tests/requests" element={<RequestTest />} />
            <Route path='/tests/requests/played' element={<PlayedVideoTest/>} />
            <Route path='*' element={<div>{`"${path}"`} page not found</div>} />
        </Routes>
      
    </Suspense>
       : 
       <Loader path={path}/>
             }
      
      




      <ToastContainer />
    </>
  )
}

export default App


  



