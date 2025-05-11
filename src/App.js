import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  // Generate a simple JWT token for demo purposes
  const getToken = () => {
    return 'demo-token'; // In a real app, this would be a proper JWT token
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setError(null);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = `${API_URL}/api/search?term=${encodeURIComponent(searchTerm)}&media=${mediaType}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch search results. Please try again.');
    }
  };

  const addToFavorites = (item) => {
    if (!favorites.some(fav => fav.trackId === item.trackId)) {
      setFavorites([...favorites, item]);
    }
  };

  const removeFromFavorites = (trackId) => {
    setFavorites(favorites.filter(item => item.trackId !== trackId));
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
            <option value="all">All</option>
            <option value="movie">Movie</option>
            <option value="podcast">Podcast</option>
            <option value="music">Music</option>
            <option value="audiobook">Audiobook</option>
            <option value="shortFilm">Short Film</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
            <option value="ebook">Ebook</option>
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
            {searchResults.map((item) => (
              <div key={item.trackId} className="col-md-4 mb-3">
                <div className="card">
                  <img src={item.artworkUrl100} className="card-img-top" alt={item.trackName} />
                  <div className="card-body">
                    <h5 className="card-title">{item.trackName}</h5>
                    <p className="card-text">{item.artistName}</p>
                    <button className="btn btn-sm btn-success" onClick={() => addToFavorites(item)}>Add to Favorites</button>
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
                <button className="btn btn-sm btn-danger" onClick={() => removeFromFavorites(item.trackId)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
