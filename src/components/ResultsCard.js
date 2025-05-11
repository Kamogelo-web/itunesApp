import React from "react";

function ResultCard({ item, addFavourite, isFavourite }) {
  const {
    artworkUrl100,
    trackName,
    collectionName,
    artistName,
    kind,
    trackViewUrl,
    previewUrl,
  } = item;

  return (
    <div className="card h-100 shadow-sm">
      {artworkUrl100 && (
        <img
          src={artworkUrl100}
          className="card-img-top"
          alt={trackName || collectionName || artistName}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{trackName || collectionName || artistName}</h5>
        <p className="card-text">
          <strong>Artist:</strong> {artistName || "N/A"}
          <br />
          <strong>Type:</strong> {kind || "N/A"}
        </p>
        <div className="mt-auto">
          {trackViewUrl && (
            <a
              href={trackViewUrl}
              className="btn btn-outline-secondary btn-sm me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          )}
          {previewUrl && (
            <a
              href={previewUrl}
              className="btn btn-outline-info btn-sm me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview
            </a>
          )}
          <button
            className="btn btn-success btn-sm"
            onClick={() => addFavourite(item)}
            disabled={isFavourite}
          >
            {isFavourite ? "Favourited" : "Add to Favourites"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;