/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react'
import './AddToCollection.css'
import { filterArray, generateCollageSrc, updateArray, updateUserProperty, userProfile } from '../../../functions/Requests/actions'
import { AddIcon, CancelIcon, TrashDuotoneIcon, TrashIcon } from '../../asset component/Icons/Icons'
import { UserContext } from '../../../UserContext'
import { toast } from 'react-toastify'


export function NewCollection({cancel, create}){
    const [collectionName, setCollectionName] = useState('')
    const [error, setError] = useState({isError: false, message: ''})
    const {user, setUser} = useContext(UserContext)
    const [collections, setCollections] = useState([])


    useEffect(() => {
            setCollections(user.userCollections)    
        }, [user])
    function submit(key=false){
        if(!collections.find(i => i.name == collectionName)){
            if(key){
                if(key.code.toLowerCase() == 'enter'){
                    collectionName.trim()!==""?createNewCollection(collectionName):setError({isError: true, message: 'Collection name cannot be empty'})                    
                }
                
            }else{
                collectionName.trim()!==""?createNewCollection(collectionName):setError({isError: true, message: 'Collection name cannot be empty'})
            }
        }else{
            setError({isError: true, message: `${collectionName} is not available`})
        }
    }
    function createNewCollection(collectionName){
        let newDate = new Date()
        
        let newCollection = {
            name: collectionName,
            items: [],
            collectionThumbnail: 'https://via.placeholder.com/150',
            id: Math.floor(Math.random()*1000000),
            date:newDate,
        }

        if (collections&&!collections.find(i => i.name === collectionName)) {
            let updated = updateArray(collections, newCollection)
            
            let updateUser = updateUserProperty(user, 'userCollections', updated)
            setUser(updateUser)
            create(collectionName)
          } else {
            return
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

function AddToCollection({item="what is the item name", cancel, add=true}) {
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const details = useRef(null)
    const [showNewCollection, setShowNewCollection] = useState(false)
    const {user, setUser} = useContext(UserContext)



    useEffect(() => {
        setCollections(user.userCollections)    
    }, [user])

    
    // close the details
    // useEffect(() => {
    //     if(details&&selectedCollection !== '' &&showNewCollection !== true){
    //         details.current.open = false
    //     }
    // }, [selectedCollection])
    useEffect(() => {
        console.log(collections);
        if(collections.length>0){  
            setSelectedCollection(collections[0].name)
        }else{
            setSelectedCollection("")
        }
    }, [collections])
   
        
    
        

    async function handleAddToCollection(collectionName){
        const updatedCollections = collections.map(async collection => {
            if (collection.name === collectionName) {
                console.log(1)
              if(collection.items&&!collection.items.find(i => i.id == item.id)){
                if(collection.collectionThumbnail=="https://via.placeholder.com/150"||collection.items.length>0){
                    const img = await generateCollageSrc(collection.items)
                    toast.success(`"${item.title}" added to ${collectionName}`)
                    return { ...collection, collectionThumbnail: img, items: [...collection.items, item] };
                }
                
              }else{
                toast.error(`"${item.title}" already exists in ${collectionName}`)
                
              }
            }
            return collection;
          });     

        const result = await Promise.all(updatedCollections)
          
        const updateUserCollection = updateUserProperty(user, 'userCollections', result)
          
        setUser(updateUserCollection)            

          
        cancel()
    }
    function deleteFromCollection(item){
        let withoutItem = collections.filter(i => i.name !== item.name)
        const updateUserCollection = updateUserProperty(user, 'userCollections', withoutItem)

        setUser(updateUserCollection)
    }
    
  return (
    <>
        {
            showNewCollection?
            <NewCollection cancel={()=>setShowNewCollection(false)} create={(val)=>{setShowNewCollection(false);setSelectedCollection(val)}}/>
            :<div className="collectionListing">
                {
                    add?<b>add {`"${item.title}"`} to</b>:null
                }
                <details ref={details}>
                <summary className={selectedCollection==""&&!collections.length>0?'new':""} onClick={()=>selectedCollection==''?setShowNewCollection(true):null}>{selectedCollection==''&&!collections.length>0?'Create new collection':selectedCollection==''?"Choose collection":selectedCollection}</summary>
                    {
                        collections.length>0?
                            <ul className="collections">
                                <li className='new' onClick={()=>setShowNewCollection(true)}>Create new collection</li>
                                {
                                    collections.map((i, index)=>{
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
                        selectedCollection!==""&&add?
                            <span className='btn_add' onClick={()=>handleAddToCollection(selectedCollection)}>Add to {`"${selectedCollection}"`}</span>
                        :null
                    }
                </div>
            </div>
        }
    </>
  )
}

export default AddToCollection