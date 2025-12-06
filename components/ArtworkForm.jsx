import React, { useState, useEffect } from "react";

export default function ArtworkForm() {
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [year, setYear] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editArtistId, setEditArtistId] = useState("");
  const [editYear, setEditYear] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/artists/")
      .then((res) => res.json())
      .then(setArtists)
      .catch(() => setError("Failed to fetch artists"));

    fetch("http://localhost:8000/artworks/")
      .then((res) => res.json())
      .then(setArtworks)
      .catch(() => setError("Failed to fetch artworks"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/artworks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist_id: parseInt(artistId),
          year: parseInt(year),
        }),
      });
      if (!response.ok) throw new Error("Failed to create artwork");
      const newArtwork = await response.json();
      setArtworks([newArtwork, ...artworks]);
      setTitle("");
      setArtistId("");
      setYear("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (artwork) => {
    setEditingId(artwork.id);
    setEditTitle(artwork.title);
    setEditArtistId(artwork.artist_id.toString());
    setEditYear(artwork.year.toString());
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/artworks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          artist_id: parseInt(editArtistId),
          year: parseInt(editYear),
        }),
      });

      if (!response.ok) throw new Error("Failed to update artwork");

      const updatedArtwork = await response.json();
      setArtworks(
        artworks.map((artwork) =>
          artwork.id === id ? updatedArtwork : artwork
        )
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/artworks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete artwork");

      setArtworks(artworks.filter((artwork) => artwork.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditArtistId("");
    setEditYear("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Artwork Form</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          required
        >
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <button type="submit">Add Artwork</button>
      </form>

      <div className="cards">
        {artworks.map((art) => (
          <div key={art.id} className="card">
            {editingId === art.id ? (
              <div className="edit-form">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
                <select
                  value={editArtistId}
                  onChange={(e) => setEditArtistId(e.target.value)}
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  required
                />
                <div className="button-group">
                  <button onClick={() => handleUpdate(art.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>{art.title}</strong>
                </p>
                <p>Artist ID: {art.artist_id}</p>
                <p>Year: {art.year}</p>
                <div className="button-group">
                  <button onClick={() => handleEdit(art)}>Edit</button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    style={{ backgroundColor: "#ff4444", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
