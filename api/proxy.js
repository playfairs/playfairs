const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/repos', async (req, res) => {
  try {
    const { platform, username } = req.body;
    
    if (platform === 'github') {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          'User-Agent': 'GitPage/1.0',
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    }
    else if (platform === 'gitlab') {
      const response = await fetch(`https://gitlab.com/api/v4/users/${username}/Git?per_page=100`, {
        headers: {
          'User-Agent': 'GitPage/1.0',
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitLab API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    }
    else {
      throw new Error('Unsupported platform');
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});
