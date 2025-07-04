
const mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    email: {type: String, required: true, maxLength: 100, unique: true},
    username: {type: String, required: true, maxLength: 100, unique: true},
    uid: {type: String, required: true, unique: true}, // Firebase UID
    isAdmin: {type: Boolean, default: false, required: true},
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);