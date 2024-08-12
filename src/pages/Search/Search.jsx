/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './Search.css'
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCard from '../../component/Main Components/MovieCard/MovieCard';
import Header from '../../component/Main Components/Header/Header';
import Profile from '../../component/Main Components/Profile/Profile';
import Back from '../../component/MinorComponents/Back/Back';
import { tmdbClient } from '../../functions/Requests/fetchApi';
import { BACKDROP_SIZE, IMAGE_BASE_URL, to_1_decimal } from '../../functions/Requests/actions';
import { GenraMap3 } from '../../component/MinorComponents/GenreMap/GenreMap';
import { LoadingComponent } from '../../component/asset component/Loader/Loader';
import { CrewCastIcon, DownloadDuotoneIcon } from '../../component/asset component/Icons/Icons';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Demo = () => {
  return(
    <>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
      <LoadingComponent/>
    </>
  )
};

function Seen({isLessThan500, genre, contents=null}){
  const navigate = useNavigate()
    return(
        <section className="Seen">
            {contents?contents.length > 0 ? (
                contents.map(result => (
                  <MovieCard 
                    imgSrc={result.poster_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+result.poster_path:result.backdrop_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+result.backdrop_path:result.profile_path? IMAGE_BASE_URL+BACKDROP_SIZE[0]+result.profile_path:null}
                    key={result.id}
                    play={true}
                    icon={result.gender||result.gender>-1?<CrewCastIcon fill='var(--baseWhite1000)'/>:<DownloadDuotoneIcon fill='var(--baseWhite1000)'/>}
                    rating={result.vote_average?to_1_decimal(result.vote_average):null}
                    text1={result.title?result.title:result.name?result.name:result.title}
                    text2={result.genre_names&&result.genre_names.length>0?<GenraMap3 genreList={result.genre_names}/>:result.overview?<b>{result.overview}</b>:null}
                    text3={result.first_air_date?result.first_air_date:result.release_date?result.release_date:null}
                    onClick={()=>navigate(`/video?title=${result.title?result.title:result.name?result.name:result.name}`)}
                    optionDrop={false}
                    verticalAlign />
                ))
              ) : (
                <p>not found</p>
                ):<Demo/>}
        </section>
    )
}
function Recommendations({isLessThan500, result, genre}){
  
  const navigate = useNavigate()
    return(
        <section className="Seen">
            <MovieCard 
                    play={true}
                    onClick={()=>navigate('video?video_id=tate-no-yuusha-no-nariagari')}
                    optionDrop={false}
                    verticalAlign />
        </section>
    )
}



function Search() {
  const location = useLocation()
  const [isLessThan500, setIsLessThan500] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [result, setSearchResult] = useState({ movies: [], tvShows: [], people: [] })
  const [reommendedResult, setRecommendedSearchResult] = useState([])
  const query = useQuery();
  const searchParam = query.get('search');
  const [genres, setGenres] = useState([]);
 
  



  const getGenreNames = (genreIds) => {
      return genreIds.map((id) => {
          const genre = genres.find((genre) => genre.id === id);
          return genre ? genre.name : 'Unknown';
      });
  };





  const handleSearch = async () => {
    try {
      const searchResults = await tmdbClient.searchAll(searchParam);
      setSearchResult(searchResults);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  useEffect(() => {
    handleSearch()
  }, [searchParam])
  useEffect(() => {
    console.log(result)
  }, [result])
  

  


    

    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
      }, [])

  return (
    <div className='SearchPaged'>
      <main>
          <Header searchParam={searchParam} openProfile={()=>setShowProfile(true)} customLeft={<Back/>}/>
          <div className="result">
              <h1>Search result for <span className="textSearched">{`"${searchParam}"`}</span></h1>
              <div className="resultCategory">
                <h1>Movies</h1>
                {
                  result?result.movies?<Seen contents={result.movies} genre="movies" isLessThan500={isLessThan500}/>:<Demo/>:<Demo/>
                }
              </div>
              <div className="resultCategory">
                <h1>TV Shows</h1>
                {
                  result?result.tvShows?<Seen contents={result.tvShows} genre="TV shows" isLessThan500={isLessThan500}/>:<Demo/>:<Demo/>
                }
              </div>
              <div className="resultCategory">
                <h1>Persons</h1>
                {
                  result?result.people?<Seen contents={result.people} genre="person" isLessThan500={isLessThan500}/>:<Demo/>:<Demo/>
                }
              </div>

          </div>
          <div className="mayLike">
              <div className="resultCategory">
                <h1>You may like</h1>
                {
                  result?result.recommendations?<Seen contents={result.recommendations} genre="recommendation" isLessThan500={isLessThan500}/>:<Demo/>:<Demo/>
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

export default Search