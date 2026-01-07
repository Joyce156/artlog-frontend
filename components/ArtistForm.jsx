import React, { useState, useEffect } from "react";

export default function ArtistForm() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editArtStyle, setEditArtStyle] = useState("");

  const fetchArtists = async () => {
    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/artists/"
      );
      if (!response.ok) throw new Error("Failed to fetch artists");
      const data = await response.json();
      setArtists(data);
    } catch (err) {
      setError("Failed to fetch artists");
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/artists/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, country, art_style: artStyle }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create artist");
      }

      const newArtist = await response.json();
      setArtists([newArtist, ...artists]);
      setName("");
      setCountry("");
      setArtStyle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (artist) => {
    setEditingId(artist.id);
    setEditName(artist.name);
    setEditCountry(artist.country);
    setEditArtStyle(artist.art_style);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `https://artlog-backend.onrender.com/artists/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            country: editCountry,
            art_style: editArtStyle,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update artist");
      }

      const updatedArtist = await response.json();
      setArtists(
        artists.map((artist) => (artist.id === id ? updatedArtist : artist))
      );
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://artlog-backend.onrender.com/artists/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete artist");

      setArtists(artists.filter((artist) => artist.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCountry("");
    setEditArtStyle("");
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="artist-form">
          <h2>👤 Add New Artist</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Artist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              placeholder="Country of origin"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artStyle">Art Style</label>
            <input
              id="artStyle"
              placeholder="Art style (e.g., Impressionism)"
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            👤 Add Artist
          </button>
        </form>
      </div>

      <div className="cards-container">
        <h3>Artists ({artists.length})</h3>

        {artists.length === 0 ? (
          <div className="empty-state">
            <p>No artists yet. Add your first artist above!</p>
          </div>
        ) : (
          <div className="artist-cards">
            {artists.map((artist) => (
              <div key={artist.id} className="artist-card">
                {editingId === artist.id ? (
                  <div className="edit-mode">
                    <div className="edit-header">
                      <h4>Edit Artist</h4>
                    </div>

                    <div className="edit-form">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                        required
                      />
                      <input
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        placeholder="Country"
                        required
                      />
                      <input
                        value={editArtStyle}
                        onChange={(e) => setEditArtStyle(e.target.value)}
                        placeholder="Art Style"
                        required
                      />

                      <div className="edit-actions">
                        <button
                          onClick={() => handleUpdate(artist.id)}
                          className="save-button"
                        >
                          💾 Save
                        </button>
                        <button onClick={cancelEdit} className="cancel-button">
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="artist-content">
                      <div className="artist-name">
                        <h4>{artist.name}</h4>
                      </div>

                      <div className="artist-details">
                        <div className="detail-item">
                          <span className="detail-label">Country:</span>
                          <span className="detail-value">{artist.country}</span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Art Style:</span>
                          <span className="detail-value">
                            {artist.art_style}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="artist-actions">
                      <button
                        onClick={() => handleEdit(artist)}
                        className="action-button edit-button"
                        title="Edit Artist"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(artist.id)}
                        className="action-button delete-button"
                        title="Delete Artist"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
