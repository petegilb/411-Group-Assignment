const express = require('express');
const router = express.Router();


const fetch = require('node-fetch');
const fetchConfig = require('../config/fetchConfig');

router.route('/')
    .get((req, res, next) => {
        res.render('index', {title: 'Express'});
    })
    .post(async (req, res, next) => {
        let input;
        if (req.body.movieTitle) {
            input = req.body.movieTitle;
        } else
            input = "Star Wars";
        let rawReturnValue = await fetch(fetchConfig.fetchOptions.url + "?apikey=" + fetchConfig.fetchOptions.key + "&t=" + input, {method: fetchConfig.fetchOptions.method});
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


module.exports = router;
