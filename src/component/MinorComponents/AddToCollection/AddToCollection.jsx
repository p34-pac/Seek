/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './AddToCollection.css'
import { filterArray, updateUserProperty, userProfile } from '../../../functions/Requests/actions'
import { AddIcon, CancelIcon, TrashDuotoneIcon, TrashIcon } from '../../asset component/Icons/Icons'


function NewCollection({cancel, create, allCollection}){
    const [collectionName, setCollectionName] = useState('')
    const [error, setError] = useState({isError: false, message: ''})
    function submit(key=false){
        if(!allCollection.find(i => i.name == collectionName)){
            if(key){
                if(key.code.toLowerCase() == 'enter'){
                    collectionName.trim()!==""?create(collectionName):setError({isError: true, message: 'Collection name cannot be empty'})                    
                }
                
            }else{
                collectionName.trim()!==""?create(collectionName):setError({isError: true, message: 'Collection name cannot be empty'})
            }
        }else{
            setError({isError: true, message: `${collectionName} is not available`})
        }
    }
    return (
        <div className="new-collection">
            <div className="input">
                <input type="text" maxLength={30} onKeyUp={(e)=>submit(e)} placeholder='Type collection name' value={collectionName} onChange={(e)=>{setCollectionName(e.target.value); setError(false)}} />
                {
                    error.isError?<b className="error" data-before={collectionName.length>=30? 'max length reached':null} data-after={`words left ${30 - collectionName.length}`}>{error.message}</b>:collectionName.trim()!==""?<b className="success" data-before={collectionName.length>=30? 'max length reached':null} data-after={`words left ${30 - collectionName.length}`}>{collectionName} is available</b>:null
                }
            </div>
            <span className="proceeding">
                <button onClick={cancel}>Cancel<CancelIcon fill='var(--baseWhite1000)' /></button>
                <button onClick={()=>submit(false)}>Create<AddIcon fill='var(--primary100)' /></button>
            </span>
        </div>
    )
}

function AddToCollection({item="what is the item name", cancel}) {
    const [collections, setCollections] = useState([])
    const [uniqueCollections, setUniqueCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const details = useRef(null)
    const [showNewCollection, setShowNewCollection] = useState(false)
    const [profileData, setProfileData] = useState(null)



    useEffect(() => {
        async function getUserCollections(){
            const profile = await userProfile.getFromStorage().then(res => JSON.parse(res))
            
            setCollections(profile.userCollections);
            setProfileData(profile);
        }
        

        getUserCollections()
      
    }, [])

    
    // close the details
    // useEffect(() => {
    //     if(details&&selectedCollection !== '' &&showNewCollection !== true){
    //         details.current.open = false
    //     }
    // }, [selectedCollection])
    useEffect(() => {
        


        setUniqueCollections(filterArray(collections))
    }, [collections])
    useEffect(() => {
        setShowNewCollection(false)
        
        if(uniqueCollections&&profileData){
            const updateUserCollection = updateUserProperty(profileData, 'userCollections', uniqueCollections)
            
            userProfile.setToStorage(updateUserCollection)

            if(uniqueCollections.length>0){
                setSelectedCollection(uniqueCollections[0].name)
            }else{
                setSelectedCollection("")
            }
        }
    }, [uniqueCollections])

    function createNewCollection(collectionName){
        let newDate = new Date()
        
        // create new collection object
        let newCollection = {
            name: collectionName,
            items: [],
            collectionThumbnail: 'https://via.placeholder.com/150',
            id: Math.floor(Math.random()*1000000),
            date:newDate,
        }

        if (!collections.find(i => i.name === collectionName)) {
            collections.push(newCollection);
            setCollections(prev => ([newCollection, ...prev]))
          } else {
            return
          }
    }
    function handleAddToCollection(collectionName){
        
        const updatedCollections = collections.map(collection => {
            if (collection.name === collectionName) {
              return { ...collection, items: [...collection.items, item] };
            }
            return collection;
          });

          
          const updateUserCollection = updateUserProperty(profileData, 'userCollections', filterArray(updatedCollections))

          
          userProfile.setToStorage(updateUserCollection);
          cancel()
    }
    function deleteFromCollection(item){
        let withoutItem = uniqueCollections.filter(i => i.name !== item.name)
        setUniqueCollections(withoutItem)
        
        
    }
    
  return (
    <div className='AddToCollection'>
        {
            showNewCollection?
            <NewCollection allCollection={uniqueCollections} cancel={()=>setShowNewCollection(false)} create={(val)=>{createNewCollection(val);setSelectedCollection(val.name)}}/>
            :<div className="collectionListing">
                <b>add {`"${item.title}"`} to</b>
                <details ref={details}>
                <summary className={selectedCollection==""&&!uniqueCollections.length>0?'new':""} onClick={()=>selectedCollection==''?setShowNewCollection(true):null}>{selectedCollection==''&&!uniqueCollections.length>0?'Create new collection':selectedCollection==''?"Choose collection":selectedCollection}</summary>
                    {
                        uniqueCollections.length>0?
                            <ul className="collections">
                                <li className='new' onClick={()=>setShowNewCollection(true)}>Create new collection</li>
                                {
                                    uniqueCollections.map((i, index)=>{
                                        return <li className={i.name==selectedCollection?'collectionItem selected':'collectionItem'} key={index}>
                                                    <b onClick={()=>setSelectedCollection(i.name)}>{i.name}</b>
                                                    <div className="end">
                                                        <b className="count">{i.items.length} Items</b>
                                                        <i className="ICN-delete" onClick={()=> deleteFromCollection(i)}><TrashDuotoneIcon fill='var(--primary100)' /></i>
                                                    </div>
                                                </li>
                                    })
                                }
                            </ul>
                        :null
                    }
                </details>
                <div className="btns">
                    <span className='btn_cancel' onClick={cancel}>cancel</span>
                    {
                        selectedCollection!==""?
                            <span className='btn_add' onClick={()=>handleAddToCollection(selectedCollection)}>Add to {`"${selectedCollection}"`}</span>
                        :null
                    }
                </div>
            </div>
        }

    </div>
  )
}

export default AddToCollection