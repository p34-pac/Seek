/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import UserDp from '../../MinorComponents/UserDp/UserDp'
import Collection from '../../MinorComponents/Collection/Collection'
import MovieCard from '../MovieCard/MovieCard'
import ActionWithIcon from '../../MinorComponents/ActionWithIcon/ActionWithIcon'
import { AddIcon, AngleLeftIcon, AngleRightIcon } from '../../asset component/Icons/Icons'
import {updateUserProperty, userProfile } from '../../../functions/Requests/actions'
import { UserContext } from '../../../UserContext'
import AddToCollection, { NewCollection } from '../../MinorComponents/AddToCollection/AddToCollection'
import Modal from '../../MinorComponents/Modal/Modal'
import { useNavigate } from 'react-router-dom'





function CollectionCardAction({fill='var(--primary100)', item, actions=[{name:'delete',action: (item)=>{return},},{name:'save',action: (item)=>{return},}]}) {
  return (
    <>
        {
            actions.map(i=>{
                return(
                    <ActionWithIcon className='newAddblast' onClick={()=>i.action(item)} key={i.name} icon={<AngleRightIcon fill={fill}/>}>{i.name}</ActionWithIcon>
                )
            })
        }
    </>
  )
}


function Profile({closeProfile}) {
    const [collections, setCollections] = useState(null)
    const {user, setUser} = useContext(UserContext)
    const [showCollections, setShowCollections] = useState(false)
    const [showAllCollections, setShowAllCollections] = useState(false)
    const navigate = useNavigate()
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

    function AddNewCollectionButton(){
        return(
            <span className="add" onClick={()=>setShowCollections(true)}>
                <b>New</b>
                <AddIcon fill='var(--baseBlack1000)'/>
            </span>
        )
    }
    function deleteFromCollection(item){
        let withoutItem = collections.filter(i => i.name !== item.name)
        const updateUserCollection = updateUserProperty(user, 'userCollections', withoutItem)

        setUser(updateUserCollection)
    }
    const collectionOptions = [
        {
            name:'Open',
            action: (item)=>{navigate(`/collection?collectionName=${item.name}`)},
        },
        {
            name:'Delete',
            action: (item)=>{deleteFromCollection(item)},
        }
        
    ]
    
  return (
    <>
        <section className='profileSection'>
        <span className="back"><i onClick={()=>closeProfile()}><AngleLeftIcon fill='var(--baseWhite1000)'/></i></span>
        <UserDp/>
        <div className="collectionsCategoryOverview">
            {/* <Collection seeAllLink="/playlists" className="Downloads" CollectionName='Downloads'>
                <MovieCard play={false} optionDrop={false} shrink={true} />
                <MovieCard play={false} optionDrop={false} shrink={true} />
                <MovieCard play={false} optionDrop={false} shrink={true} />
            </Collection> */}
            <Collection seeAll={collections&&collections.length>0?false:<AddNewCollectionButton />} seeAllAction={()=>setShowAllCollections(true)} className="MyCollections" CollectionName='My Collections'>
                
                {
                    collections && collections.map((collection, index) => {
                        return <MovieCard 
                                    onClick={()=>navigate(`/collection?collectionName=${collection.name}`)}
                                    text1={<b>{collection.name}</b>}
                                    text2={<b>{collection.items.length} item{collection.items.length>1?'s':''}</b>}
                                    text3={<GetTime full={collection.date} />}
                                    key={collection.id}
                                    imgSrc={collection.collectionThumbnail?collection.collectionThumbnail:'https://via.placeholder.com/150'}
                                    play={false}
                                    optionDrop
                                    optionDropOnRight
                                    shrink={true}
                                    optionDropItems={<CollectionCardAction item={collection} actions={collectionOptions} fill='var(--primary100)'/>}
                                />
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
    {
        showCollections?
            <Modal defaultCancel={false}>
                <NewCollection cancel={()=>setShowCollections(false)} create={()=>setShowCollections(false)} />
            </Modal>
        :null
    }
    {
        showAllCollections?
            <Modal defaultCancel={false}>
                <AddToCollection cancel={()=>setShowAllCollections(false)} add={false} />
            </Modal>
        :null
    }
    
    </>
  )
}

export default Profile