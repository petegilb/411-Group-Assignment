const mongoose = require('mongoose')
const Schema = mongoose.Schema

//User Schema
const userSchema = new Schema({
    id: { type: String, unique: true },
    likedMovies: [String],
    googleId: String
}, { collection : 'User' });

module.exports = mongoose.model('User', userSchema);
