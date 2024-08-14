/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import UserDp from '../../MinorComponents/UserDp/UserDp'
import Collection from '../../MinorComponents/Collection/Collection'
import MovieCard from '../MovieCard/MovieCard'
import ActionWithIcon from '../../MinorComponents/ActionWithIcon/ActionWithIcon'
import { AngleLeftIcon, AngleRightIcon } from '../../asset component/Icons/Icons'
import {userProfile } from '../../../functions/Requests/actions'
import { UserContext } from '../../../UserContext'


const defActions = [
    {
        name:'delete',
        action: ()=>{return},
    },
    {
        name:'save',
        action: ()=>{return},
    }
]


function CollectionCardAction({fill='var(--primary100)', actions=defActions}) {
  return (
    <>
        {
            actions.map(i=>{
                return(
                    <ActionWithIcon onClick={()=>i.action()} key={i.name} icon={<AngleRightIcon fill={fill}/>}>{i.name}</ActionWithIcon>
                )
            })
        }
    </>
  )
}


function Profile({closeProfile}) {
    const [collections, setCollections] = useState(null)
    const {user, setUser} = useContext(UserContext)
    useEffect(() => {
        if(user.id){
            setCollections(user.userCollections);
        }
      }, [user])


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
        <UserDp userInfo={user}/>
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