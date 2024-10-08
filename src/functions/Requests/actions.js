/* eslint-disable no-unused-vars */

import Cookies from "universal-cookie";
import { tmdbClient } from "./fetchApi";
import CryptoJS from 'crypto-js';

// Function to generate a secure key
export async function generateKey() {
  const key = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
  return Array.from(key).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

  const cookies = new Cookies()
  // Function to store the key in the cache'
export async function storeKeyInCookie(key) {

  if(cookies.get('secret-key')){
    return
  }else{
    cookies.set('secret-key', key, { path: '/' });    
  }
}


// Function to retrieve the key from the cache
function getKeyFromCookie() {
  if(cookies.get('secret-key')){
    return cookies.get('secret-key')
  }else{
    return null
  }

}
export  const  SECRET = async ()=>{
  // Retrieve the key and use it  
  return getKeyFromCookie()
  
}






   class TMDBActions {


    async generateRecommendations(likedGenres){
        const movieGenres = await tmdbClient.fetchGenres('movie');
        const tvGenres = await tmdbClient.fetchGenres('tv');
      
        const genreMapping = {
          ...tmdbClient.mapUserGenresToTMDB(likedGenres, movieGenres),
          ...tmdbClient.mapUserGenresToTMDB(likedGenres, tvGenres)
        };
      
        let recommendations = [];
        
        for (const genre of likedGenres) {
          const genreId = genreMapping[genre.toLowerCase()];
          if (genreId) {
            const movies = await tmdbClient.fetchGenreRecommendations(genreId, 'movie');
            const tvShows = await tmdbClient.fetchGenreRecommendations(genreId, 'tv');


            const movieGenresMapping = tmdbClient.createGenreMapping(movieGenres);
            const tvGenresMapping = tmdbClient.createGenreMapping(tvGenres);


            const moviesWithGenreNames = tmdbClient.replaceGenreIdsWithNames(movies, movieGenresMapping);
            const tvShowsWithGenreNames = tmdbClient.replaceGenreIdsWithNames(tvShows, tvGenresMapping);
            
            recommendations.push({
              genre: genre,
              movies: moviesWithGenreNames.slice(0, 5), // Top 5 movies
              tvShows: tvShowsWithGenreNames.slice(0, 5) // Top 5 TV shows
            });
          }
        }
      
        return recommendations;
      }


    async getRecommendations(likedGenre){
        try {
          const recommendations = await this.generateRecommendations(likedGenre);
          // Store recommendations in a variable
          const userRecommendations = recommendations;      
          return userRecommendations
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }


    async getMoviesWithGenreNames (){
        try {
        // Fetch genres and create a mapping
        const genres = await tmdbClient.fetchGenres();
        const genreMapping = tmdbClient.createGenreMapping(genres);
    
        // Fetch movies
        const movies = await tmdbClient.fetchMovies();
    
        // Replace genre IDs with genre names
        const moviesWithGenreNames = tmdbClient.replaceGenreIdsWithNames(movies, genreMapping);
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
  }
  export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
  export const BACKDROP_SIZE = ['w300', 'w780', 'w1280', 'original']; // You can choose between 
  export const to_1_decimal = (number)=>{
    let a_decimal = parseFloat(number.toFixed(1))

    return a_decimal
  }
  export function replaceSpecific(str, what, wit) {
    return str.replace(new RegExp(what, 'g'), wit);
    }
    export function splitBySlash(inputString) {
        return inputString.split(' / ').map(item => item.trim());
    }

export const convertTimeToPercentage = (currentTime, totalDuration) => {
    if (totalDuration <= 0) return 0; // Avoid division by zero

    // Calculate percentage
    let percentage = (currentTime / totalDuration) * 100;

    // Ensure percentage is between 1 and 100
    percentage = Math.max(1, Math.min(100, percentage));

    return percentage;
    
};

export class StorageManager {
  constructor(storage = 'encryptedData') {
    this.storage = storage;
  }

  async encryptData(data) {    
    
    if(await SECRET()){      
      return CryptoJS.AES.encrypt(data, await SECRET()).toString();
    }
  }

  async decryptData(ciphertext) {
    try {
      if(await SECRET()){
        const bytes = CryptoJS.AES.decrypt(ciphertext, await SECRET());
        
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData ? decryptedData : []; // Return an empty array if data is invalid
      }

    } catch (error) {
      console.error('Error decrypting data:', error);
       // Clear local storage
      localStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      return []; // Return an empty array if decryption fails
    }
  }

  async getFromStorage(setDef=[]) {
    const encryptedData = localStorage.getItem(this.storage);
    if (!encryptedData) {
      this.setToStorage(setDef);
      return [];
    }

    
    return await this.decryptData(encryptedData);
  }

  async setToStorage(data) {
    
    const encryptedData = await this.encryptData(JSON.stringify(data));
    localStorage.setItem(this.storage, encryptedData);
    return data
  }

  updateStoredArray(newItem) {
    const data = this.getFromStorage();
    if (data.includes(newItem)) return; // Don't add if item already exists

    data.unshift(newItem); // Add to the start

    if (data.length > 10) {
      data.pop(); // Remove last item if length exceeds 10
    }
    
    this.setToStorage(data);
  }
}



export const updateArray = (array, newItem, maxLength=6) => {
  // Check if the newItem is already in the array
  if (array.includes(newItem)) {
    return array; // Return the array unchanged if the item is already present
  }

  // If the array length is 10 or more, remove the last item
  if (array.length >= maxLength) {
    array.pop(); // Remove the last item from the array
  }

  // Add the newItem to the start of the array
  array.unshift(newItem);

  return array;
};

export const deleteFromArray = (array=["aa", "ab", "ac", "ad", "item"], itemToDelete="item") => {
  // Check if the itemToDelete is in the array
  if (!array.includes(itemToDelete)) {
    return array; // Return the array unchanged if the item is not present
  }

  return(array.filter(i => i!==itemToDelete))
}

export function generateArrayOfRandomNumbers(range = 5){
    if (range > 30) {
        throw new Error("Range cannot be greater than 30 as it exceeds the number of unique values possible.");
    }

    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < range) {
        uniqueNumbers.add(Math.floor(Math.random() * 30) + 1);
    }

    return Array.from(uniqueNumbers);
}
export function range(max=5, min=0){
    let ranged = []
    for(let i=min; i<=max; i++){
      ranged.push(i)
    }
    return ranged
}
export function getRandomValues(arr=[5, 4, 3, 22, 11], count=5) {
  // Create a copy of the array to avoid mutating the original array
  const arrayCopy = [...arr];

  // Shuffle the array using the Fisher-Yates (Knuth) shuffle algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  // Return the first 'count' elements from the shuffled array
  return arrayCopy.slice(0, count);
}
export function updateUserProperty(user, propertyPath, newValue) {
  const keys = propertyPath.split('.');
  let current = user;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  const lastKey = keys[keys.length - 1];

  if (Array.isArray(current[lastKey]) && Array.isArray(newValue)) {
    // Merge arrays and remove duplicates
    current[lastKey] = Array.from(new Set([...newValue]));
  } else {
    // Update property value
    current[lastKey] = newValue;
  }

  return { ...user };
}

export const generateCollageSrc = async (collection) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const images = collection.slice(0, 4).map(movie => `https://image.tmdb.org/t/p/${BACKDROP_SIZE[BACKDROP_SIZE.length-1]}${movie.poster_path}`);
  
  const loadImages = images.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    });
  });

  try {
    const imgs = await Promise.all(loadImages);

    // Determine canvas size and image sizes based on the number of images
    const size = BACKDROP_SIZE[BACKDROP_SIZE.length - 2].split('w')[1];

    canvas.width = size * (imgs.length === 1 ? 1 : 2);
    canvas.height = size * (imgs.length === 1 ? 1 : 2);

    if (imgs.length === 1) {
        const img = imgs[0];
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    } else if (imgs.length === 2) {
        imgs.forEach((img, index) => {
            const scale = Math.max(size / img.width, canvas.height / img.height);
            const x = index * size;
            ctx.drawImage(img, x, 0, img.width * scale, img.height * scale);
        });
    } else if (imgs.length === 3) {
        imgs.forEach((img, index) => {
            const scale = Math.max(size / img.width, size / img.height);
            const x = (index % 2) * size;
            const y = index === 2 ? size : 0;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        });
    } else if (imgs.length === 4) {
        imgs.forEach((img, index) => {
            const scale = Math.max(size / img.width, size / img.height);
            const x = (index % 2) * size;
            const y = Math.floor(index / 2) * size;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        });
    }

    return canvas.toDataURL();
  } catch (err) {
    console.error('Error loading images:', err);
    return null;
  }
};

export function filterArray(array){
  const uniqueCollection = array.reduce((acc, current) => {
    if (!acc.some(item => item.id === current.id)) {
      acc.push(current);
      
    }
    return acc;
  }, []);

  return uniqueCollection
}





export const tmdbAction = new TMDBActions()
// export const userCollections = new StorageManager("myCollections");
export const userProfile = new StorageManager("user");


  