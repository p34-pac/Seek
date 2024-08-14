/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import { register } from './serviceWorkerRegistration';
import { generateKey, storeKeyInCookie, userProfile } from './functions/Requests/actions.js'
import UserContextProvider from './UserContext.jsx'


// Generate and store the key
generateKey().then(key => {
  storeKeyInCookie(key).then(() => console.log('Secret key stored in cookie.'));
});
export const defUser = {
  id: null,
  name: 'John Doe',
  email: 'john.doe@example.com',
  userCollections: [],
  searchHistory: [],
  favoriteGenres: [],
}
if(!localStorage.getItem('user')){
  const defaultUse = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    userCollections: [],
    searchHistory: [],
    favoriteGenres: [],
  }
  
  userProfile.setToStorage(defaultUse).then(res => console.log(res))
}





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <UserContextProvider def={defUser}>
          <App />
        </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// Register the service worker
// register();