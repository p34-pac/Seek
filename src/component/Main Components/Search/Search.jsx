/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import './Search.css';
import { ArrowBendUpIcon, CancelIcon, SearchIcon } from '../../asset component/Icons/Icons';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import {deleteFromArray, updateArray, updateUserProperty, userProfile } from '../../../functions/Requests/actions';

function ListContent({ icon, text, action }) {
  return (
    <li className='ListContent'>
      <b className="searchedText">{text}</b>
      <span className="insert" onClick={action}>{icon}</span>
    </li>
  );
}

function Search({ setParentalFocus, loadParam }) {
  const [focused, setFocused] = useState(false);
  const input = useRef(null);
  const [inputText, setInputText] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function savePD(){
      setProfileData(await userProfile.getFromStorage().then(res=>JSON.parse(res)))
    }
    savePD()

  }, []);


  useEffect(() => {
    const setStore = async ()=>{
      if (profileData) {
        setSearchData(profileData.searchHistory)
        console.log(profileData);
        
      }
    }

    setStore()
  }, [profileData]);






  const handleRedirect = async () => {
    navigate(`/search?search=${inputText}`);
    
  };

  useEffect(() => {
    if (loadParam&&profileData) {
      const updatedSearch = updateArray(searchData, loadParam);
      
      const updatedObj = updateUserProperty(profileData, 'searchHistory', updatedSearch)

      userProfile.setToStorage(updatedObj)

    }
    setFocused(false)
  }, [loadParam, searchData])
  

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
            />
            <button onClick={handleRedirect} className='searchGo'>
              <SearchIcon />
            </button>
          </li>
          {focused && (
            <li className="searchSuggestion">
              <ul className='suggestion'>
                <ListContent icon={<ArrowBendUpIcon />} />
                <ListContent icon={<ArrowBendUpIcon />} />
                <ListContent icon={<ArrowBendUpIcon />} />
                <ListContent icon={<ArrowBendUpIcon />} />
              </ul>
              <div className='recent'>
                <span className="top">
                  <b>Recent searches</b>
                  <button>Clear all</button>
                </span>
                <ul>
                  
                  {searchData.length>0?searchData.map((data, index) => (
                    <ListContent key={index} text={data} action={()=>{
                     
                      setSearchData(deleteFromArray(searchData, data))
                    }} icon={<CancelIcon fill='var(--baseWhite1000)' />} />
                  )):null}
                </ul>
              </div>
              <div className='trending'>
                <span className="top">
                  <b>What is trending</b>
                  <button>Clear all</button>
                </span>
                <ul>
                  <ListContent icon={<ArrowBendUpIcon fill='var(--baseWhite1000)' />} />
                  <ListContent icon={<ArrowBendUpIcon fill='var(--baseWhite1000)' />} />
                  <ListContent icon={<ArrowBendUpIcon fill='var(--baseWhite1000)' />} />
                  <ListContent icon={<ArrowBendUpIcon fill='var(--baseWhite1000)' />} />
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
