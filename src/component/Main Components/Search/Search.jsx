/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import './Search.css';
import { ArrowBendUpIcon, CancelIcon, SearchIcon } from '../../asset component/Icons/Icons';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import {deleteFromArray, updateArray, updateUserProperty, userProfile } from '../../../functions/Requests/actions';
import { UserContext } from '../../../UserContext';

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
    if (loadParam&&searchData) {
      
      const updatedSearch = updateArray(searchData, loadParam);
      
      const updatedObj = updateUserProperty(user, 'searchHistory', updatedSearch)

      userProfile.setToStorage(updatedObj)
    }
    setFocused(false)
  }, [loadParam])






  const handleRedirect = async (key=false) => {
    if(key){
        if(key&&key.code.toLowerCase() == 'enter' && inputText.trim()!=''){
          navigate(`/search?search=${inputText}`);
          
        }
        
    }else{
      if(inputText.trim()!=''){
        navigate(`/search?search=${inputText}`);
      }
    }
    
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
              onKeyUp={(e)=>handleRedirect(e)}
              value={inputText}
              
            />
            <button onClick={()=>handleRedirect(false)} className='searchGo'>
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
                    <ListContent key={index} onClick={() => {setInputText(data); handleRedirect()}} text={data} action={()=>{
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
