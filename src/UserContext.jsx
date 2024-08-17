/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { generateCollageSrc, updateUserProperty, userProfile } from './functions/Requests/actions'
import Loader from './component/asset component/Loader/Loader'
import Modal from './component/MinorComponents/Modal/Modal'
import { setColor } from './App'
export const UserContext = createContext()
function UserContextProvider({children}) {
  const [message, setMessage] = useState({type: 'error', message: 'error retrieving content', return: false})
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    async function getUser(){
      if(!localStorage.getItem('user')){
        const defaultUse = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          userCollections: [],
          searchHistory: [],
          favoriteGenres: [],
        }
        
        userProfile.setToStorage(defaultUse).then(res => setUser(res))
      }else{
        try {
          await userProfile.getFromStorage().then(res => {
            setUser(JSON.parse(res))
      
            setMessage({type: 'success', message: `welcome ${JSON.parse(res).name}`, return: true})
            setLoading(false)
          })
        } catch (error) {
          localStorage.clear()
          setMessage({type: 'error', message: 'error retrieving content', return: true})
        }
        
      }
    }
    useEffect(() => {
      getUser()
      setColor()
      
    }, [])
    useEffect(() => {
      async function update() {
        const updateUsers = user.userCollections.map(async collection => {
          const collectionThumbnail = await generateCollageSrc(collection.items)
          const collectionData = { ...collection, collectionThumbnail }
          return(collectionData);
        })
        const content = await Promise.all(updateUsers)
        const updateUserWithCollectionWithThumbnail = updateUserProperty(user, 'userCollections', content)
        userProfile.setToStorage(updateUserWithCollectionWithThumbnail).then(res => res)

        
      }


        if(user&&user.id > 0){         
           update()
        }
        
      }, [user])
      useEffect(() => {
        if(message.return&&message.type == 'error'){
          return
        }
        
      }, [message])
      useEffect(() => {
        setTimeout(() => {
          if(!loading&&user){
            setMessage({type: 'success', message: `welcome ${user.name}`, return: true})
            return
          }else if(loading){           
            setLoading(false)
            setMessage({type: 'error', message: 'taking too much time to load', return: true})
          }
  
        }, 10000);
      }, [loading])

      
  return (
    <>
      {
        message.return?
          <>
            {
              message.type=='error'?
                <Modal className='Error' defaultCancel={false} >
                  <div className='errorPage'>
                    <h1>{message.message}</h1>
                    <h2>please refresh</h2>
                    <button onClick={()=>window.location.reload()}>Click to refresh</button>
                  </div>
                </Modal>
              :message.type=='success'?
                <>
                  {!loading&&user?
                    <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
                  :null
                  }
                </>
              :null
            }
          </>
        :loading?
            <>
              <Loader path='Please wait'/>
            </>
        :null
      }
    </>
  )
}

export default UserContextProvider