/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { userProfile } from './functions/Requests/actions'
export const UserContext = createContext()
function UserContextProvider({children, def}) {
    const [user, setUser] = useState(def)

    useEffect(() => {
      async function getUser(){
        const profile = await userProfile.getFromStorage().then(res => JSON.parse(res))
        setUser(profile);
      }
      getUser()
    }, [])
    useEffect(() => {
        if(user.id){          
            userProfile.setToStorage(user).then(res => console.log(res))
            
        }
        console.log(user);
        
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