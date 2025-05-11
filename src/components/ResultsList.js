import React from "react";
import ResultCard from "./ResultCard";

function ResultsList({ results, loading, addFavourite, favourites }) {
  if (loading) {
    return <div className="text-center my-4">Loading...</div>;
  }
  if (!results.length) {
    return <div className="text-muted my-4">No results to display.</div>;
  }
  return (
    <div className="row">
      {results.map((item) => (
        <div className="col-md-6 col-lg-4 mb-4" key={item.trackId || item.collectionId || item.artistId}>
          <ResultCard
            item={item}
            addFavourite={addFavourite}
            isFavourite={!!favourites.find((fav) => fav.trackId === item.trackId)}
          />
        </div>
      ))}
    </div>
  );
}

export default ResultsList;