const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// CORS configuration
const corsOptions = {
  origin: '*', // In production, replace with your actual domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// JWT Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // For development, you might want to bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // For demo purposes, using a simple hardcoded check
  // In a real application, you would validate against a database
  if (username === 'demo' && password === 'demo123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// API endpoint to fetch data from iTunes
app.get('/api/search', authenticateToken, async (req, res) => {
  const { term, media } = req.query;
  
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  // Validate media type
  const validMediaTypes = ['all', 'movie', 'podcast', 'music', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook'];
  if (media && !validMediaTypes.includes(media)) {
    return res.status(400).json({ error: 'Invalid media type' });
  }

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=${media || 'all'}&limit=25`;
  
  try {
    console.log('Fetching from iTunes API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`iTunes API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response data
    const formattedResults = data.results.map(item => ({
      trackId: item.trackId,
      trackName: item.trackName,
      artistName: item.artistName,
      artworkUrl100: item.artworkUrl100,
      releaseDate: item.releaseDate,
      kind: item.kind,
      wrapperType: item.wrapperType,
      collectionName: item.collectionName,
      trackPrice: item.trackPrice,
      currency: item.currency,
      description: item.description,
      longDescription: item.longDescription
    }));

    res.json({
      resultCount: formattedResults.length,
      results: formattedResults
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 