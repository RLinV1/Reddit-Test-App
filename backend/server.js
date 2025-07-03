const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/posts'); 
const User = require('./models/users');
const Vote = require('./models/votes'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/evbuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB') 
}).catch(err => {
  console.error('MongoDB connection error:', err)
  });

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

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ upvotes: -1 });
  res.json(posts);
});

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/upvote', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const updatedPost = await Post.findByIdAndUpdate(id, { $set: { upvotes: post.upvotes + 1 } }, { new: true });
    res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});


app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});

