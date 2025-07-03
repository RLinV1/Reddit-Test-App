const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  username: { type: String, required: true },
  vote: { type: Number, enum: [1, -1], required: true }, 
}, {
  timestamps: true 
});


VoteSchema.index({ post: 1, username: 1 }, { unique: true }); // Ensure a user can only vote once per post

const Vote = mongoose.model('Vote', VoteSchema);