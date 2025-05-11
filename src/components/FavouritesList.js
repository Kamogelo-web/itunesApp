import React from "react";

function FavouritesList({ favourites, removeFavourite }) {
  return (
    <div>
      <h4>Favourites</h4>
      {favourites.length === 0 && (
        <div className="text-muted">No favourites yet.</div>
      )}
      <ul className="list-group">
        {favourites.map((item) => (
          <li className="list-group-item d-flex align-items-center" key={item.trackId}>
            {item.artworkUrl60 && (
              <img
                src={item.artworkUrl60}
                alt={item.trackName}
                className="me-2"
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />
            )}
            <div className="flex-grow-1">
              <strong>{item.trackName || item.collectionName || item.artistName}</strong>
              <div className="text-muted" style={{ fontSize: "0.9em" }}>
                {item.artistName}
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFavourite(item.trackId)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavouritesList;