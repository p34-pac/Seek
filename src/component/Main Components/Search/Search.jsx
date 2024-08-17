/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import './Search.css';
import { ArrowBendUpIcon, CancelIcon, SearchIcon } from '../../asset component/Icons/Icons';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import {deleteFromArray, updateArray, updateUserProperty, userProfile } from '../../../functions/Requests/actions';
import { UserContext } from '../../../UserContext';
import { tmdbClient } from '../../../functions/Requests/fetchApi';

function ListContent({ icon, text, action, onClick }) {
  return (
    <li className='ListContent'>
      <b className="searchedText" onClick={onClick}>{text}</b>
      <span className="insert" onClick={action}>{icon}</span>
    </li>
  );
}

function Search({ setParentalFocus, loadParam }) {
  const [focused, setFocused] = useState(false);
  const input = useRef(null);
  const [inputText, setInputText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const {user, setUser} = useContext(UserContext)
  const navigate = useNavigate();




  useEffect(() => {
    const setStore = async ()=>{
      if (user&&user.searchHistory) {
        setSearchData(user.searchHistory)
      }
    }

    setStore()
  }, [user]);
  useEffect(() => {
    if (loadParam&&searchData&&user) {
      const updatedSearch = updateArray(searchData, loadParam);
      
      const updatedObj = updateUserProperty(user, 'searchHistory', updatedSearch)

      setUser(updatedObj)
    }
  }, [loadParam])

  useEffect(() => {
    if (user) {
      tmdbClient.recommendMovies(user.favoriteGenres, user.userCollections, user.searchHistory).then(res => {
        // const includeTrending
        const updated = updateUserProperty(user, 'trending', res)
        setUser(updated);
        
      })
    }
  }, [searchData])





  const handleRedirect = async (key=false, value=inputText) => {
    if(key){
        if(key&&key.code.toLowerCase() == 'enter' && value.trim()!=''){
          navigate(`/search?search=${value}`);
        }
        
    }else{
      if(value.trim()!=''){
        navigate(`/search?search=${value}`);
      }
    }
    setFocused(true)
    
  };
 

  const handleFocus = () => setFocused(true);

  const handleBlur = (e) => {
    if (input.current && input.current.contains(e.relatedTarget)) {
      return;
    }

    if (e.relatedTarget && e.relatedTarget.classList.contains("searchGo")) {
      setFocused(true);
    } else {
      setFocused(false);
    }
    
  };

  useEffect(() => {
    setParentalFocus(focused);
  }, [focused]);

  



  return (
    <>
      <div className='search' ref={input} tabIndex={-1} onBlur={handleBlur}>
        <ul>
          <li className='input'>
            <input
              onChange={(e) => setInputText(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="text"
              placeholder="Find movies and series"
              onKeyUp={(e)=>handleRedirect(e, inputText)}
              value={inputText}             
            />
            <button onClick={()=>handleRedirect(false, inputText)} className='searchGo'>
              <SearchIcon />
            </button>
          </li>
          {focused && (
            <li className="searchSuggestion">
              
              {searchData.length>0?
                <div className='recent'>
                  <span className="top">
                    <b>Recent searches</b>
                    <button onClick={()=>{
                      const updatedObj = updateUserProperty(user, 'searchHistory', [])
                      setUser(updatedObj)
                    }}>Clear all</button>
                  </span>
                  <ul>
                    {
                      searchData.map((data, index) => (
                      <ListContent key={index} onClick={() => {handleRedirect(null, data)}} text={data} action={()=>{
                        setSearchData(deleteFromArray(searchData, data))
                        const deleted = deleteFromArray(searchData, data)
                        const updatedObj = updateUserProperty(user, 'searchHistory', deleted)
                        setUser(updatedObj)
                      }} icon={<CancelIcon fill='var(--baseWhite1000)' />} />
                    ))
                    }
                  </ul>

                </div>
              :null}
              <div className='trending'>
                <span className="top">
                  <b>You may like</b>
                </span>
                <ul>
                  {user&&user.trending.length>0?user.trending.filter(i => !searchData.includes(i.title)).map((data, index) => (
                    index<6?
                      <ListContent key={index} onClick={() => {handleRedirect(null, data.title)}} text={data.title} icon={<ArrowBendUpIcon fill='var(--baseWhite1000)' />} />
                    :null
                  )):null}
                </ul>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Search;
