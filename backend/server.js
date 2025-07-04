const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/posts'); 
const User = require('./models/users');
const Vote = require('./models/votes'); 

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/evbuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB') 
}).catch(err => {
  console.error('MongoDB connection error:', err)
  });

// get a specific user by uid
app.get("/api/users/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) {    
      return res.status(404).json({ error: 'User not found' });
    } 
    res.json(user);
  } catch (error) { 
    res.status(500).json({ error: error.message });
  }
});

// create a new user
app.post("/api/users", async (req, res) => {
  const { uid, email, username, isAdmin } = req.body;

  try {
    const user = new User({ uid, email, username, isAdmin });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// create a new post
app.post('/api/posts', async (req, res) => {
  const { title, content, username } = req.body;
  if (!title || !content || !username) {
    return res.status(400).json({ error: 'Title, content and username are required' });
  }

  try {
    const post = new Post({ title, content, username });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all posts sorted by upvotes from highest to lowest
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ upvotes: -1 });
  res.json(posts);
});

app.get('/api/votes/:uid', async (req, res) => {
  const { uid } = req.params;
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    const vote = await Vote.find({ uid });
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


// remove a post by id
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/posts/upvote', async (req, res) => {
  const { id, uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  let voteChange = 0; 

  const existingVote = await Vote.findOne({ post: id, uid });

  if (existingVote) {
    if (existingVote.vote === 1) {
      await Vote.deleteOne({ post: id, uid }); // if the user removes their upvote, we delete the vote
      voteChange = -1;  
    } else {
      existingVote.vote = 1;
      await existingVote.save();
      voteChange = 2; // if the user changes from downvote to upvote, we add 2 to the upvotes i.e -1 -> 1 
    }
  } else {
    // New upvote
    const newVote = new Vote({ post: id, uid, vote: 1 });
    await newVote.save();
    voteChange = 1;
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { upvotes: voteChange } }, // increment instead of set
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.post('/api/posts/downvote', async (req, res) => {
  const { id, uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  let voteChange = 0;

  const existingVote = await Vote.findOne({ post: id, uid });

  if (existingVote) {
    if (existingVote.vote === -1) {
      await Vote.deleteOne({ post: id, uid }); // if the user removes their downvote, we delete the vote
      voteChange = 1; 
    } else {
      existingVote.vote = -1;
      await existingVote.save();
      voteChange = -2;   // if the user changes from upvote to downvote, we subtract 2 from the upvotes i.e 1 -> -1
    }
  } else {
    const newVote = new Vote({ post: id, uid, vote: -1 });
    await newVote.save();
    voteChange = -1;
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { upvotes: voteChange } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});

