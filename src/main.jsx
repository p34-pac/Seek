/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { register } from './serviceWorkerRegistration';
import { generateKey, storeKeyInCache, userProfile } from './functions/Requests/actions.js'


// Generate and store the key
generateKey().then(key => {
  storeKeyInCache(key).then(() => console.log('Secret key stored in cache.'));
});
export const defUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  userCollections: [],
  searchHistory: [],
  favoriteGenres: [],
}
if(!localStorage.getItem('user')){
  
  userProfile.setToStorage(defUser).then(res => console.log(res))
}





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      
        <App def={defUser} />
    </BrowserRouter>
  </React.StrictMode>,
)

// Register the service worker
register();