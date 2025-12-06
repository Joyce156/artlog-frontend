import React, { useState, useEffect } from "react";

export default function ArtworkForm() {
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [year, setYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editArtistId, setEditArtistId] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
          image_url: imageUrl || null,
          description: description || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create artwork");
      const newArtwork = await response.json();
      setArtworks([newArtwork, ...artworks]);
      setTitle("");
      setArtistId("");
      setYear("");
      setImageUrl("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (artwork) => {
    setEditingId(artwork.id);
    setEditTitle(artwork.title);
    setEditArtistId(artwork.artist_id.toString());
    setEditYear(artwork.year.toString());
    setEditImageUrl(artwork.image_url || "");
    setEditDescription(artwork.description || "");
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
          image_url: editImageUrl || null,
          description: editDescription || null,
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
    setEditImageUrl("");
    setEditDescription("");
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="artwork-form">
          <h2>🖼️ Add New Artwork</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              placeholder="Artwork title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Artwork description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="artistId">Artist</label>
            <select
              id="artistId"
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
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              type="number"
              placeholder="Creation year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (optional)</label>
            <input
              id="imageUrl"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            🖼️ Add Artwork
          </button>
        </form>
      </div>

      <div className="cards-container">
        <h3>Artworks ({artworks.length})</h3>

        {artworks.length === 0 ? (
          <div className="empty-state">
            <p>No artworks yet. Add your first artwork above!</p>
          </div>
        ) : (
          <div className="artwork-cards">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                {editingId === art.id ? (
                  <div className="edit-mode">
                    <div className="edit-header">
                      <h4>Edit Artwork</h4>
                    </div>
                    <div className="edit-form">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        required
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        rows="2"
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
                        placeholder="Year"
                        required
                      />
                      <input
                        placeholder="Image URL"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => handleUpdate(art.id)}
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
                    {art.image_url && (
                      <div className="artwork-image">
                        <img
                          src={art.image_url}
                          alt={art.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <div
                          className="image-placeholder"
                          style={{ display: "none" }}
                        >
                          No Image Available
                        </div>
                      </div>
                    )}
                    <div className="artwork-content">
                      <div className="artwork-name">
                        <h4>{art.title}</h4>
                      </div>
                      {art.description && (
                        <div className="detail-item">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">
                            {art.description}
                          </span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Artist ID:</span>
                        <span className="detail-value">{art.artist_id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Year:</span>
                        <span className="detail-value">{art.year}</span>
                      </div>
                    </div>

                    <div className="artwork-actions">
                      <button
                        onClick={() => handleEdit(art)}
                        className="action-button edit-button"
                        title="Edit Artwork"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="action-button delete-button"
                        title="Delete Artwork"
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
