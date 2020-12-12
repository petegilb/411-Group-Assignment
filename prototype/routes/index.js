const express = require('express');
const router = express.Router();


const fetch = require('node-fetch');
const fetchConfig = require('../config/fetchConfig');

router.route('/')
    .get((req, res, next) => {
        res.render('index', {title: 'Movie Recommendations'});
    })
    .post(async (req, res, next) => {
        const movieJson = require('../movies.json');
        let genre = (req.body.MovieGenre ? req.body.MovieGenre: 'Action');
        let movies = movieJson["movies"];
        //res.render('index', {results: "you chose " + genre});
        //console.log(movieJson["movies"][0]["title"]);

        //find random movie matching the genre
        let movieTitle = await findMovie(genre, movies);
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
                posterURL: cleanReturnValue["Poster"]
            });
        } catch (error) {
            res.render('index', {results: "unable to find movie"});
        }
    })

//function to find a random movie from the list
const findMovie = async (genre, movies) => {
    let filteredMov = movies.filter(movie => movie["genres"].includes(genre));
    return(filteredMov[Math.floor(Math.random() * filteredMov.length)]["title"]);
}

module.exports = router;
