import React from "react";

const MEDIA_TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movie" },
  { value: "podcast", label: "Podcast" },
  { value: "music", label: "Music" },
  { value: "audiobook", label: "Audiobook" },
  { value: "shortFilm", label: "Short Film" },
  { value: "tvShow", label: "TV Show" },
  { value: "software", label: "Software" },
  { value: "ebook", label: "eBook" },
];

function MediaTypeSelect({ mediaType, setMediaType }) {
  return (
    <select
      className="form-select"
      value={mediaType}
      onChange={(e) => setMediaType(e.target.value)}
    >
      {MEDIA_TYPES.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  );
}

export default MediaTypeSelect;