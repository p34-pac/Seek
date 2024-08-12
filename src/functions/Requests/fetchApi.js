/* eslint-disable no-unused-vars */

const API_KEY = '99e130d9e6fb5ac8f90dab4883abea8e'
const BASE_URL = 'https://api.themoviedb.org/3';

class TMDBClient {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

    async fetchGenres(type = 'movie') {
        const endpoint = `${this.baseUrl}/genre/${type}/list`;
        const response = await fetch(`${endpoint}?api_key=${this.apiKey}`);
        const data = await response.json();
        return data.genres;
        
    }
    
    
    async fetchGenreAll(){
        const genreTypes = ['movie', 'tv'];
        const genrePromises = genreTypes.map(type => this.fetchGenres(type));

        
        try {
            const [movieGenres, tvGenres] = await Promise.all(genrePromises);
            const allGenres = [...movieGenres, ...tvGenres];
            
            // Removing duplicates based on genre id
            const uniqueGenres = Array.from(new Set(allGenres.map(genre => genre.id)))
                .map(id => allGenres.find(genre => genre.id === id));
    
            return uniqueGenres;
        } catch (error) {
            console.error('Error fetching genres:', error);
            return [];
        }
    }

    mapUserGenresToTMDB(userGenres, tmdbGenres) {
        const genreMapping = {};
        tmdbGenres.forEach(genre => {
        if (userGenres.includes(genre.name.toLowerCase())) {
            genreMapping[genre.name.toLowerCase()] = genre.id;
        }
        });
        return genreMapping;
    }

    createGenreMapping(genres) {
        const genreMapping = {};
        genres.forEach(genre => {
        genreMapping[genre.id] = genre.name;
        });
        return genreMapping;
    }

    replaceGenreIdsWithNames(movies, genreMapping) {
        return movies.map(movie => {
        const genreNames = movie.genre_ids.map(id => genreMapping[id]);
        return { ...movie, genre_names: genreNames };
        });
    }

    async fetchMovies() {
        const endpoint = `${this.baseUrl}/discover/movie`;
        const response = await fetch(`${endpoint}?api_key=${this.apiKey}`);
        const data = await response.json();
        return data.results;
    }

    async replaceWithGenreName(array){
            const genres = await tmdbClient.fetchGenres();
            const genreMapping = tmdbClient.createGenreMapping(genres);
            const contentWithGenreNames = tmdbClient.replaceGenreIdsWithNames(array, genreMapping);
            return contentWithGenreNames
    }
    async fetchGenreRecommendations(genreId, type = 'movie') {
        const endpoint = `${this.baseUrl}/discover/${type}`;
        const response = await fetch(`${endpoint}?api_key=${this.apiKey}&with_genres=${genreId}`);
        const data = await response.json();
        return data.results;
    }

    async fetchVariousGenreRecommendations(genres){
        
        const genreTypes = ['movie', 'tv'];
        // const genrePromises = genreTypes.map(type => this.fetchGenres(type));
        let mixedRec = []
        genreTypes.map(type => {
            genres.forEach(genre => {
                mixedRec.push(this.fetchGenreRecommendations(genre.id, type));
            })
        })

        try {
            const [movieRec, tvRec] = await Promise.all(mixedRec)
            const allRec = [movieRec, tvRec];

            const combine = await this.combineArray(allRec)
            // Fetch genres and create a mapping
            const contentWithGenreNames = await this.replaceWithGenreName(combine);
            return contentWithGenreNames
        } catch (error) {
            return
        }
    }
    async searchMovies(query) {
        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            const genres = await this.fetchGenres();
            const genreMap = genres.reduce((map, genre) => {
                map[genre.id] = genre.name;
                return map;
            }, {});

            // Add genre names to the movie results
            const moviesWithGenres = data.results
            .filter(movie => movie.genre_ids && movie.genre_ids.length > 0)
            .map(movie => ({
                ...movie,
                genres: movie.genre_ids.map(id => genreMap[id] || 'Unknown Genre'),
            }));

            return moviesWithGenres;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    }
    async combineArray(array){
        let combinedResults = []
        array.map(i => {
            combinedResults.push(...i)
        })

        return combinedResults
    }
    async searchAll(query) {
        const types = ['movie', 'tv', 'person'];
        const searchPromises = types.map(type => this.search(query, type));
        
        try {
            // Fetch search results for all types
            const [moviesResults, tvShowsResults, peopleResults] = await Promise.all(searchPromises);
            
            // Fetch genres for movies and TV shows
            const movieGenres = await this.fetchGenres('movie');
            const tvGenres = await this.fetchGenres('tv');
            
            // Create genre mappings
            const movieGenreMapping = this.createGenreMapping(movieGenres);
            const tvGenreMapping = this.createGenreMapping(tvGenres);
            
            // Enrich movie results with genre names
            const movies = moviesResults
            .filter(movie => movie.genre_ids && movie.genre_ids.length > 0)
            .map(movie => ({
                ...movie,
                genre_names: movie.genre_ids.map(id => movieGenreMapping[id] || 'Unknown Genre')
            }))
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
            .sort((a, b) => b.vote_average - a.vote_average);
            
            // Enrich TV show results with genre names
            const tvShows = tvShowsResults
            .filter(tvShow => tvShow.genre_ids && tvShow.genre_ids.length > 0)
            .map(tvShow => ({
                ...tvShow,
                genre_names: tvShow.genre_ids.map(id => tvGenreMapping[id] || 'Unknown Genre')
            }))
            .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
            .sort((a, b) => b.vote_average - a.vote_average);

            const people = peopleResults
            .filter(persons => persons.gender && persons.gender > 0)
            .sort((a, b) => b.popularity - a.popularity)
             
            // Combine all results into a single array
            const combinedResults = await this.combineArray([movies, tvShows]);

            // Sort combined results by popularity (or any other desired criteria)
            const sortedCombinedResults = combinedResults.sort((a, b) => {
                if (a.popularity && b.popularity) {
                    return b.popularity - a.popularity;
                }
                return 0;
            });

            // Optionally, limit the number of recommendations
            const recommendations = sortedCombinedResults.slice(0, 20);

            return {
                movies,
                tvShows,
                people,
                recommendations
            };
        } catch (error) {
            console.error('Error fetching search results:', error);
            throw error;
        }
    }
    async search(query, type = 'movie') {
    let url;
    switch (type) {
        case 'movie':
        url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
        break;
        case 'tv':
        url = `${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
        break;
        case 'person':
        url = `${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
        break;
        default:
        throw new Error('Invalid search type');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Failed to fetch ${type} search results`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`Error fetching ${type} search results:`, error);
        throw error;
    }
    }




    async getMovieCredits(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch movie credits');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    }

    async getMovieRecommendations(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch movie recommendations');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movie recommendations:', error);
            throw error;
        }
    }

    async getRecommendationsByMovieName(movieName) {
        try {
            const searchResults = await this.searchMovieByName(movieName);
            if (searchResults.length === 0) {
                throw new Error('No movies found with that name');
            }
            const movieId = searchResults[0].id;
            const recommendations = await this.getMovieRecommendations(movieId);
            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    }
    async searchMoviesByGenre(genreId) {
        const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch movies by genre');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            throw error;
        }
    }

    async getRecommendationsByGenres(genreNames) {
        try {
            const genres = await this.fetchGenres();
            const genreMap = genres.reduce((map, genre) => {
                map[genre.name.toLowerCase()] = genre.id;
                return map;
            }, {});

            const genreIds = genreNames.map(name => genreMap[name.toLowerCase()]).filter(id => id !== undefined);

            if (genreIds.length === 0) {
                throw new Error('No valid genres found');
            }

            const recommendationsPromises = genreIds.map(genreId => this.searchMoviesByGenre(genreId));
            const recommendationsResults = await Promise.all(recommendationsPromises);

            // Combine results and remove duplicates
            const allRecommendations = recommendationsResults.flat();
            const uniqueRecommendations = Array.from(new Set(allRecommendations.map(movie => movie.id)))
                .map(id => allRecommendations.find(movie => movie.id === id));

            return uniqueRecommendations;
        } catch (error) {
            console.error('Error getting recommendations by genres:', error);
            throw error;
        }
    }
    async getMovieVideos(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch movie videos');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movie videos:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    }
}

// Usage Example
export const tmdbClient = new TMDBClient(API_KEY, BASE_URL);

export const getMoviesWithGenreNames = async () => {
  try {
    // Fetch genres and create a mapping
    const genres = await tmdbClient.fetchGenres();
    const genreMapping = tmdbClient.createGenreMapping(genres);

    // Fetch movies
    const movies = await tmdbClient.fetchMovies();

    // Replace genre IDs with genre names
    const moviesWithGenreNames = tmdbClient.replaceGenreIdsWithNames(movies, genreMapping);

    return(moviesWithGenreNames);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

