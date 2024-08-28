/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './VideoDescription.css'
import { DownloadIcon, PlayFillIcon, SaveCollectionIcon } from '../../asset component/Icons/Icons'
import PlaylistSelected from '../../../pages/Playlist/PlaylistSelected'
import { CastCrewsCard } from '../../MinorComponents/MovieCardCustom/MovieCardCustom'
import MovieCard from '../../Main Components/MovieCard/MovieCard'
import { tmdbClient } from '../../../functions/Requests/fetchApi'
import { BACKDROP_SIZE, IMAGE_BASE_URL, splitBySlash, tmdbAction } from '../../../functions/Requests/actions'
import { useNavigate } from 'react-router-dom'
import { LoadingComponent } from '../../asset component/Loader/Loader'
import AddToCollection from '../../MinorComponents/AddToCollection/AddToCollection'
import Modal from '../../MinorComponents/Modal/Modal'

function VideoDescription({videoInfo}) {
    const [selectTab, setSelectTab] = useState("description")
    const navigate = useNavigate()
    const [credits, setCredits] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [collectionPopUp, setCollectionPopUp] = useState(false);

    useEffect(() => {
        setSelectTab("description")
        const fetchCredits = async () => {
            try {
                if(videoInfo){
                    const data = await tmdbClient.getMovieCredits(videoInfo.id);
                    setCredits(data);
                    let recommendation = await tmdbClient.getMovieRecommendations(videoInfo.id)
                    if(recommendation.length<1){
                        recommendation = await tmdbClient.getRecommendationsByGenres(videoInfo.genres)
                    }
                    setRecommendations(recommendation);
                }
            } catch (error) {
                setError('Error fetching movie credits');
            } finally {
                setLoading(false);
            }
        };

        fetchCredits();
    }, [videoInfo]);

    
    function MapCastCrew({type}){
        return(
            type.map((person, index)=>{
                return (
                    index<10?
                        person.character?
                            person.character.includes("/")?
                                splitBySlash(person.character).map((role, index)=>{
                                    return <li key={index}><CastCrewsCard img={person.profile_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+person.profile_path:null} person={person.name} position={role}/></li>
                                })
                            :<li key={index}><CastCrewsCard img={person.profile_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+person.profile_path:null} person={person.name} position={person.character}/></li>
                        :person.job?
                            person.job.includes("/")?
                                splitBySlash(person.job).map((role, ind)=>{
                                    return <li key={`${index}${ind}`}><CastCrewsCard img={person.profile_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+person.profile_path:null} person={person.name} position={role}/></li>
                                })
                            :<li key={index}><CastCrewsCard img={person.profile_path?IMAGE_BASE_URL+BACKDROP_SIZE[0]+person.profile_path:null} person={person.name} position={person.job}/></li>
                        :null
                    :null
                )
            })
        )
    }

    function goTo(location){
        let a = document.createElement("a")
        a.href = location
        document.body.appendChild(a)
        a.click()
    }


    


  return (
    <>
        <div className='VideoDescription'>
        <div className="descriptionTop">
            <div className="sectionTitle">
                <span onClick={()=> setSelectTab("description")} data-current={selectTab=="description"?true:false}>Description</span>
                <span onClick={()=> setSelectTab("recommended")} data-current={selectTab=="recommended"?true:false}>Recommended</span>
            </div>
            <div className="sectionActions">
                <span onClick={()=>setCollectionPopUp(true)}>Add to collection <SaveCollectionIcon fill='var(--baseWhite1000)' opacity={1}/></span>
                <span>Download <DownloadIcon fill='var(--baseWhite1000)'/></span>
            </div>
        </div>
        <main className="context">
            <section className="peoples">
                <h1>Cast and Crews</h1>
                <div className="staring">
                    <h3>Staring</h3>
                    <ul className="casts">
                        
                        {
                            credits?
                                <MapCastCrew type={credits.cast}/>
                            :<>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                            </>
                        }

                    </ul>
                </div>
                <div className="crews">
                    <h3>Crews</h3>
                    <ul className="crewsList">
                        {
                            credits?
                                <MapCastCrew type={credits.crew}/>
                            :<>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                                <LoadingComponent/>
                            </>
                        }
                    </ul>
                </div>
            </section>
           
            {
                selectTab=="description"?
                    <section className="description">
                        <h1>{videoInfo?videoInfo.title:"Desciption"}</h1>
                        
                        <div className="descriptionBody">
                            <p>{videoInfo.overview}</p>
                        </div>
                    </section>
                :selectTab=="recommended"?
                    <section className="recommend">
                        {
                            recommendations?recommendations.map((recommendation, index)=>{
                                return index<20?
                                            <MovieCard key={index} 
                                                imgSrc={IMAGE_BASE_URL+BACKDROP_SIZE[0]+recommendation.backdrop_path}
                                                text1={recommendation.title}
                                                optionDropOnRight={true}
                                                shrink={true}
                                                onClick={()=>goTo(`?title=${encodeURIComponent(recommendation.title)}`)}
                                            />
                                        :null
                            }):null
                        }
                    </section>
                :false
            }
        </main>
        
    </div>
    {
        collectionPopUp?<Modal defaultCancel={false} shown={collectionPopUp}>
            <AddToCollection  item={videoInfo} cancel={()=>setCollectionPopUp(false)} />
        </Modal>:null
    }
    </>
    
  )
}

export default VideoDescription