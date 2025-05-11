import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // iTunes Search API URL
  const ITUNES_API_URL = 'https://itunes.apple.com/search';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setError(null);
    setLoading(true);

    try {
      const mediaParam = mediaType === 'all' ? '' : `&media=${mediaType}`;
      const response = await fetch(
        `${ITUNES_API_URL}?term=${encodeURIComponent(searchTerm)}${mediaParam}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center mb-4">iTunes Search App</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search iTunes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select form-select-lg"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="podcast">Podcasts</option>
                  <option value="music">Music</option>
                  <option value="audiobook">Audiobooks</option>
                  <option value="shortFilm">Short Films</option>
                  <option value="tvShow">TV Shows</option>
                  <option value="software">Software</option>
                  <option value="ebook">Ebooks</option>
                </select>
              </div>
              <div className="col-md-2">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            {/* Search Results */}
            <div className="col-md-8">
              <h2 className="mb-3">Search Results</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {results.map((item) => (
                  <div key={item.trackId} className="col">
                    <div className="card h-100">
                      <img 
                        src={item.artworkUrl100} 
                        className="card-img-top" 
                        alt={item.trackName}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.trackName}</h5>
                        <p className="card-text">
                          <strong>Artist:</strong> {item.artistName}<br/>
                          <strong>Type:</strong> {item.kind || item.wrapperType}<br/>
                          <strong>Release Date:</strong> {formatDate(item.releaseDate)}
                        </p>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`btn btn-sm ${isFavorite(item) ? 'btn-success' : 'btn-outline-success'}`}
                        >
                          {isFavorite(item) ? '★ Favorited' : '☆ Add to Favorites'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites Sidebar */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h2 className="h5 mb-0">Favorites</h2>
                </div>
                <div className="card-body">
                  {favorites.length === 0 ? (
                    <p className="text-muted">No favorites yet</p>
                  ) : (
                    <div className="list-group">
                      {favorites.map((item) => (
                        <div key={item.trackId} className="list-group-item">
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.artworkUrl100} 
                              alt={item.trackName}
                              className="me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-0">{item.trackName}</h6>
                              <small className="text-muted">{item.artistName}</small>
                            </div>
                            <button
                              onClick={() => toggleFavorite(item)}
                              className="btn btn-sm btn-outline-danger ms-2"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
