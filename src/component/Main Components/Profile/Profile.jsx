/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import './Profile.css'
import UserDp from '../../MinorComponents/UserDp/UserDp'
import Collection from '../../MinorComponents/Collection/Collection'
import MovieCard from '../MovieCard/MovieCard'
import ActionWithIcon from '../../MinorComponents/ActionWithIcon/ActionWithIcon'
import { AngleLeftIcon, AngleRightIcon } from '../../asset component/Icons/Icons'
import {userProfile } from '../../../functions/Requests/actions'




function CollectionCardAction({fill='var(--primary100)'}) {
  return (
    <>
        <ActionWithIcon icon={<AngleRightIcon fill={fill}/>}>Download</ActionWithIcon>
        <ActionWithIcon icon={<AngleRightIcon fill={fill}/>}>save</ActionWithIcon>
        <ActionWithIcon icon={<AngleRightIcon fill={fill}/>}>share</ActionWithIcon>
    </>
  )
}


function Profile({closeProfile}) {
    const [profile, setProfile] = useState(null)
    const [collections, setCollections] = useState(null)
    useEffect(() => {
      async function initiateProfile() {
        setProfile(await userProfile.getFromStorage().then(res => JSON.parse(res)));
      }
      initiateProfile()
    }, [])
    useEffect(() => {
        if(profile){
            setCollections(profile.userCollections);
        }
      }, [profile])


    function GetTime({full}){
        const [date, setDate] = useState({dd:'', mm: '', yy: ''})
        useEffect(() => {
            let initiate = new Date(full)
            let format = {dd:'', mm: '', yy: ''}
            let day = initiate.getDate()
            let month = initiate.getMonth()
            let year = initiate.getFullYear()
            format.dd = day.toString().padStart(2, '0') 
            format.mm = month.toString().padStart(2, '0')
            format.yy = year.toString()
            setDate(format)
            
        }, [full])
        
        return (
            <>
                {date.dd}-{date.mm}-{date.yy}
            </>
        )
    }

    
  return (
    <>
        <section className='profileSection'>
        <span className="back"><i onClick={()=>closeProfile()}><AngleLeftIcon fill='var(--baseWhite1000)'/></i></span>
        <UserDp userInfo={profile}/>
        <div className="collectionsCategoryOverview">
            <Collection seeAllLink="/playlists" className="Downloads" CollectionName='Downloads'>
                <MovieCard play={false} optionDrop={false} shrink={true} />
                <MovieCard play={false} optionDrop={false} shrink={true} />
                <MovieCard play={false} optionDrop={false} shrink={true} />
            </Collection>
            <Collection className="MyCollections" CollectionName='My Collections'>
                
                {
                    collections && collections.map((collection, index) => {
                        return <MovieCard 
                                    text1={<b>{collection.name}</b>}
                                    text2={<b>{collection.items.length} item{collection.items.length>1?'s':''}</b>}
                                    text3={<GetTime full={collection.date} />}
                                    key={collection.id}
                                    imgSrc={collection.collectionThumbnail?collection.collectionThumbnail:'https://via.placeholder.com/150'}
                                    play={false}
                                    optionDrop
                                    optionDropOnRight
                                    shrink={true}
                                ><CollectionCardAction fill='var(--primary100)' /></MovieCard>
                    })
                }
                
            </Collection>
            <Collection className="Preferences" CollectionName='Preferences' showSeeAll={false}>
                <ActionWithIcon iconFill="var(--baseBlack800)">
                    <b>Storage</b>
                </ActionWithIcon>
                <ActionWithIcon iconFill="var(--baseBlack800)">
                    <b>Language</b>
                </ActionWithIcon>
                <ActionWithIcon iconFill="var(--baseBlack800)">
                    <b>Privacy Policy</b>
                </ActionWithIcon>
                <ActionWithIcon iconFill="var(--baseBlack800)">
                    <b>Help</b>
                </ActionWithIcon>
            </Collection>
        </div>
    </section>
    </>
  )
}

export default Profile