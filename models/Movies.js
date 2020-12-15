const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Movie Schema
const movieSchema = new Schema({
    title: { type: String, unique: true },
    movieInfo: String
}, { collection : 'Movies' });

module.exports = mongoose.model('Movies', movieSchema);
