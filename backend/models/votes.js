const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  uid: { type: String, required: true }, // reference to the user who voted could also use a user ID
  vote: { type: Number, enum: [1, -1], required: true },
}, {
  timestamps: true 
});


VoteSchema.index({ post: 1, uid: 1 }, { unique: true }); // Ensure a user can only vote once per post

module.exports = mongoose.model('Vote', VoteSchema);