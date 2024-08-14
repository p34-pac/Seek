/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { userProfile } from './functions/Requests/actions'
export const UserContext = createContext()
function UserContextProvider({children}) {
  const defUser = {
    id: null,
    name: 'John Doe',
    email: 'john.doe@example.com',
    userCollections: [],
    searchHistory: [],
    favoriteGenres: [],
  }
    const [user, setUser] = useState(defUser)
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
        console.log( await userProfile.getFromStorage().then(res => setUser(JSON.parse(res))));
        
      }
    }
    useEffect(() => {
      
      getUser()
    }, [])
    useEffect(() => {
        if(user.id > 0){                    
            userProfile.setToStorage(user).then(res => console.log(res))
        }
        
      }, [user])

    
  return (
    <>
      {user.id?
        <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
      :null
      }
    </>
  )
}

export default UserContextProvider