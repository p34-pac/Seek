/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './Home.css'
import Carousel from '../../component/Main Components/Carousel/Carousel'
import { images } from '../../component/asset component/Components preview/ComponentsPreview'
import MovieCard from '../../component/Main Components/MovieCard/MovieCard'
import Header from '../../component/Main Components/Header/Header'
import Profile from '../../component/Main Components/Profile/Profile'
import { BACKDROP_SIZE, generateArrayOfRandomNumbers, IMAGE_BASE_URL, range } from '../../functions/Requests/actions'
import { GenraMap3 } from '../../component/MinorComponents/GenreMap/GenreMap'
import { useNavigate } from 'react-router-dom'


function image(path){
    return IMAGE_BASE_URL+BACKDROP_SIZE[0]+path
}
function ForYou({isLessThan500, forYouArray, page, setPage}){
    const [rangeArray, setRangeArray] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
      setRangeArray(range(page.maxPage, 1))
    }, [page])
    useEffect(() => {
        console.log(rangeArray);
    }, [rangeArray])
    
    return(
        <>
            <section className="forYou">
            {
                forYouArray.map((forYou, index) => {
                   return <>
                        {
                            index <= ((forYouArray.length-1)/page.maxPage)*page.page && index >= ((forYouArray.length-1)/page.maxPage)*(page.page-1)? 
                             <MovieCard text1={forYou.title}
                                    text2={<GenraMap3 genreList={forYou.genre_names} />}
                                    text3={forYou.release_date?forYou.release_date:forYou.first_air_date?forYou.first_air_date:null}
                                    imgSrc={forYou.poster_path?image(forYou.poster_path):forYou.backdrop_path?image(forYou.backdrop_path):null}
                                    key={forYou.title+forYou.id+index}
                                    verticalAlign={isLessThan500}
                                    onClick={()=> navigate(`/video?title=${forYou.title}`)}
                                    />
                            :null
                        }
                    </>
                })
            }

            
        </section>
            <ul className="pagination">
                {
                    rangeArray.map(i => {
                        return <li key={i} onClick={()=>setPage(i)} className={page.page === i ? 'page active' : 'page'}>{i}</li>
                    })
                }
            </ul>
        </>
    )
}
function Trending({isLessThan500}){
    

    return(
        <section className="trending">
            <MovieCard verticalAlign={isLessThan500}/>
            <MovieCard verticalAlign={isLessThan500}/>
        </section>
    )
}





function Home({forYou}) {
    const [tab, setTab] = useState(1)
    const [page, setPage] = useState(1)
    const [minPage, setMinPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    
    const [isLessThan500, setIsLessThan500] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    function isWidthLessThan500() {
        return window.innerWidth < 500;
      }

      useEffect(() => {
        setIsLessThan500(isWidthLessThan500())
      }, [])
      useEffect(() => {
        // setMaxPage((forYou.length-1)/10)
        if(Math.round(((forYou.length-1)/10))%2 == 0){
            setMaxPage(Math.round(((forYou.length-1)/10)))
        }else{
            setMaxPage(Math.round(((forYou.length-1)/10))+1)
        }
        
      }, [forYou])


  return (
 <>
    <div className='Home'>
            
            <main>
                <Header openProfile={()=>setShowProfile(true)}/>
                <Carousel images={images}/>
                <div className="section">
                    <ul className="tabs">
                        <li className={tab==1?"pres":null} onClick={()=>setTab(1)}><b>For you</b></li>
                        <li className={tab==2?"pres":null} onClick={()=>setTab(2)}><b>Trending</b></li>
                    </ul>
                    {
                        tab==1?
                            <ForYou setPage={(val)=>setPage(val)} page={{page, maxPage, minPage}} isLessThan500={isLessThan500} forYouArray={forYou}/>
                        :tab==2?
                            <Trending isLessThan500={isLessThan500}/>
                        :null
                    }
                </div>  
            </main>

            {
                showProfile?
                    <Profile closeProfile={()=>setShowProfile(false)}/>
                :null
            }   
    </div>
    
    </>
  )
}

export default Home