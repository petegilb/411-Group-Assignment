### About this Project
Our Group Assignment is a web app built with Express, Node, MongoDB, and Passport for the OAuth. The project's goal is to serve movie recommendations and does so by calling two api's to retrieve movies and then retrieve information about those movies. Currently it supports saving movies and storing those movies in mongoDB to the corresponding user. Login currently only supports google logins that are part of the .bu organization. 

### Group Members
Peter Gilbert, Isk Daud Mah, Amy Huang, Andrew Coughlan, Ji Weiqi, Helen Feng

### API's Used
TMDB (The Movie Database) https://developers.themoviedb.org/3/
OMDB (Online Movie Database) http://www.omdbapi.com/

### How to Run
The required modules are listed in the package file so if you are in the directory all you should have to do is run: npm install to install everything.\
From there run, bin/www and it should be hosted on localhost:3000 by default\
The different Nav tabs at the top correspond to the different parts of our project\

Home: the homepage and main functionality\
My List: shows the current saved movies for whoever is logged in (frontend not yet complete)\
Concept: shows the frontend concept for what a completed app could look like\
Login: allows the user to login using Google OAuth\
Logout: Logs out the user\

Users cookies last for 1 day before deletion.\

### Planned Features
Caching Movie information and data so that when we look at myList it shows the information that corresponds to the movie and the poster and the rating information
