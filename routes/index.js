const express = require('express');
const router = express.Router();

//for OAuth
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dboauthKeys = require("../config/dboauthConfig");

//for MongoDB/Mongoose
const mongoose = require('mongoose');
const mongoURL = dboauthKeys.mongodb.dbURL;
const Schema = mongoose.Schema;

//for cookies
const cookieSession = require("cookie-session");

mongoose.connect(mongoURL, { useNewUrlParser: true});
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected:', mongoURL)
})
db.on('error', err => {
    console.error('connection error:', err)
})
const User = require('../models/User');
const Movies = require('../models/Movies');

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

passport.use(
    new GoogleStrategy({
        clientID: dboauthKeys.google.clientID,
        clientSecret: dboauthKeys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check if user already exists in our db with the given profile ID
        User.findOne({googleId: profile.id}).then((currentUser)=>{
            if(currentUser){
                //if we already have a record with the given profile ID
                done(null, currentUser);
            } else{
                //if not, create a new user
                new User({
                    googleId: profile.id,
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        })
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

router.use(cookieSession({
    // milliseconds of a day
    maxAge: 24*60*60*1000,
    keys:[dboauthKeys.session.cookieKey]
}));

router.use(passport.initialize());
router.use(passport.session());

//variable to store the last movie information
let lastMovie;

router.route('/')
    .get((req, res, next) => {
        res.render('index', {title: 'Movie Recommendations', currentUser: req.user});
    })
    .post(async (req, res, next) => {
        //const movieJson = require('../movies.json');
        let genre = (req.body.MovieGenre ? req.body.MovieGenre: '28');
        //let movies = movieJson["movies"];

        //tmdb api usage
        let rawMovies = await fetch(tmdbConfig.tmdbOptions.url + "discover/movie" + "?api_key=" + tmdbConfig.tmdbOptions.key + "&with_genres=" + genre + "&sort_by=vote_average.desc&vote_count.gte=250", {method: fetchConfig.fetchOptions.method});
        let cleanMovies = await rawMovies.json();

        const movieChoice = await findMovie(cleanMovies, genre);
        //console.log(movieChoice);

        let movieTitle = await movieChoice["title"];
        //now find the information off of the movie title -> eventually we will want to store this in a database
        let rawReturnValue = await fetch(fetchConfig.fetchOptions.url + "?apikey=" + fetchConfig.fetchOptions.key + "&t=" + movieTitle, {method: fetchConfig.fetchOptions.method});
        const cleanReturnValue = await rawReturnValue.json();
        //try to render the results
        try {
            res.render('index', {
                currentUser: req.user,
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
let findMovie = async (movies, genre) => {
    const numPages = parseInt(movies["total_pages"]);
    let page = Math.floor(Math.random() * numPages) + 1;
    //call it again but with a random page
    let rawMovies = await fetch(tmdbConfig.tmdbOptions.url + "discover/movie" + "?api_key=" + tmdbConfig.tmdbOptions.key + "&with_genres=" + genre + "&sort_by=vote_average.desc&vote_count.gte=250" + "&page=" + page, {method: fetchConfig.fetchOptions.method});
    const cleanMovies = await rawMovies.json();
    return cleanMovies["results"][Math.floor(Math.random() * cleanMovies["results"].length)];
}


//for OAuth

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/auth/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.redirect("/");
});

router.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.redirect("/auth/google");
});

router.get("/logout", (req, res) => {
    res.redirect("/auth/logout");
});

router.get("/concept", (req, res) => {
    res.render("concept");
});

module.exports = router;
