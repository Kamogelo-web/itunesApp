import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('music');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get the API URL from environment variable or use default
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Generate a demo JWT token (in production, this should be handled by a proper auth system)
  const getToken = () => {
    // For development, return a dummy token
    if (process.env.NODE_ENV === 'development') {
      return 'dummy-token';
    }
    // In production, you should implement proper JWT generation
    return 'your-production-token';
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/search?term=${encodeURIComponent(searchTerm)}&media=${mediaType}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch search results');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.trackId === item.trackId);
      if (exists) {
        return prev.filter(fav => fav.trackId !== item.trackId);
      }
      return [...prev, item];
    });
  };

  const isFavorite = (item) => {
    return favorites.some(fav => fav.trackId === item.trackId);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">iTunes Search App</h1>
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="music">Music</option>
            <option value="movie">Movies</option>
            <option value="podcast">Podcasts</option>
            <option value="audiobook">Audiobooks</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <h2>Search Results</h2>
          <div className="row">
            {results.map((item) => (
              <div key={item.trackId} className="col-md-4 mb-3">
                <div className="card">
                  <img src={item.artworkUrl100} className="card-img-top" alt={item.trackName} />
                  <div className="card-body">
                    <h5 className="card-title">{item.trackName}</h5>
                    <p className="card-text">{item.artistName}</p>
                    <button
                      onClick={() => toggleFavorite(item)}
                      className={isFavorite(item) ? 'btn btn-sm btn-success active' : 'btn btn-sm btn-success'}
                    >
                      {isFavorite(item) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <h2>Favorites</h2>
          <ul className="list-group">
            {favorites.map((item) => (
              <li key={item.trackId} className="list-group-item d-flex justify-content-between align-items-center">
                {item.trackName}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="btn btn-sm btn-danger"
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
