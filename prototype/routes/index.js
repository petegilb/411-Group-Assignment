const express = require('express');
const router = express.Router();


const fetch = require('node-fetch');
const fetchConfig = require('../config/fetchConfig');
const tmdbConfig = require('../config/tmdbConfig');
//genres fetched from tmdb with their corresponding ids for api calls
const genres= [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
]

router.route('/')
    .get((req, res, next) => {
        res.render('index', {title: 'Movie Recommendations'});
    })
    .post(async (req, res, next) => {
        const movieJson = require('../movies.json');
        let genre = (req.body.MovieGenre ? req.body.MovieGenre: '28');
        let movies = movieJson["movies"];

        //tmdb api usage
        //let rawReturnValue = await fetch(tmdbConfig.tmdbOptions.url + "genre/movie/list" + "?api_key=" + tmdbConfig.tmdbOptions.key, {method: fetchConfig.fetchOptions.method});
        //let rawReturnValue = await fetch(tmdbConfig.tmdbOptions.url + "3/movie/550" + "?api_key=" + tmdbConfig.tmdbOptions.key, {method: fetchConfig.fetchOptions.method});
        let rawMovies = await fetch(tmdbConfig.tmdbOptions.url + "discover/movie" + "?api_key=" + tmdbConfig.tmdbOptions.key + "&with_genres=" + genre + "&sort_by=vote_average.desc&vote_count.gte=250", {method: fetchConfig.fetchOptions.method});
        let cleanMovies = await rawMovies.json();
        cleanMovies = await findMovie(cleanMovies, genre);
        //console.log(cleanMovies);
        const movieChoice = cleanMovies["results"][Math.floor(Math.random() * cleanMovies["results"].length)];
        console.log(movieChoice);
        let movieTitle = movieChoice["title"];
        //now find the information off of the movie title -> eventually we will want to store this in a database
        let rawReturnValue = await fetch(fetchConfig.fetchOptions.url + "?apikey=" + fetchConfig.fetchOptions.key + "&t=" + movieTitle, {method: fetchConfig.fetchOptions.method});
        const cleanReturnValue = await rawReturnValue.json();
        //res.render('index', {results: fetchConfig.fetchOptions.url + "?apikey=" + fetchConfig.fetchOptions.key + "&t=" + input});
        try {
            res.render('index', {
                results: cleanReturnValue["Title"],
                year: cleanReturnValue["Year"],
                rating: cleanReturnValue["Rated"],
                movieRuntime: cleanReturnValue["Runtime"],
                genre: cleanReturnValue["Genre"],
                plot: cleanReturnValue["Plot"],
                metascore: cleanReturnValue["Metascore"],
                imdbRating: cleanReturnValue["imdbRating"],
                imdbVotes: cleanReturnValue["imdbVotes"],
                posterURL: cleanReturnValue["Poster"],
                tmdbRating: movieChoice["vote_average"],
                tmdbNumVotes: movieChoice["vote_count"],
            });
        } catch (error) {
            res.render('index', {results: "unable to find movie"});
        }
    })

//function to find a random movie from the list
const findMovie = async (movies, genre) => {
    const numPages = parseInt(movies["total_pages"]);
    let page = 1 + Math.floor(Math.random() * numPages);
    //call it again but with a random page
    let rawMovies = await fetch(tmdbConfig.tmdbOptions.url + "discover/movie" + "?api_key=" + tmdbConfig.tmdbOptions.key + "&with_genres=" + genre + "&sort_by=vote_average.desc&vote_count.gte=1000" + "&page=" + page, {method: fetchConfig.fetchOptions.method});
    const cleanMovies = await rawMovies.json();
    return cleanMovies;
}

module.exports = router;
