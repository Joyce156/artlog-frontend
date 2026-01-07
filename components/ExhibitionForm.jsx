import React, { useState, useEffect } from "react";

export default function ExhibitionForm() {
  const [theme, setTheme] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [artworkId, setArtworkId] = useState("");
  const [exhibitions, setExhibitions] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTheme, setEditTheme] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editArtworkId, setEditArtworkId] = useState("");
  const [artworks, setArtworks] = useState([]);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/exhibitions/"
      );
      if (!response.ok) throw new Error("Failed to fetch exhibitions");
      const data = await response.json();
      setExhibitions(data);
    } catch (err) {
      setError("Failed to fetch exhibitions");
    }
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/artworks/"
      );
      if (!response.ok) throw new Error("Failed to fetch artworks");
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      console.error("Fetch artworks error:", err);
    }
  };

  useEffect(() => {
    fetchExhibitions();
    fetchArtworks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/exhibitions/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location,
            theme,
            date,
            artwork_id: artworkId ? parseInt(artworkId) : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create exhibition");
      }

      const newExhibition = await response.json();
      setExhibitions([newExhibition, ...exhibitions]);
      setTheme("");
      setLocation("");
      setDate("");
      setArtworkId("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (exhibition) => {
    setEditingId(exhibition.id);
    setEditTheme(exhibition.theme || "");
    setEditLocation(exhibition.location || "");
    setEditDate(exhibition.date ? exhibition.date.split("T")[0] : "");
    setEditArtworkId(exhibition.artwork_id || "");
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `https://artlog-backend.onrender.com/exhibitions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: editLocation,
            theme: editTheme,
            date: editDate,
            artwork_id: editArtworkId ? parseInt(editArtworkId) : null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update exhibition");

      const updatedExhibition = await response.json();
      setExhibitions(
        exhibitions.map((ex) => (ex.id === id ? updatedExhibition : ex))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exhibition?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://artlog-backend.onrender.com/exhibitions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete exhibition");

      setExhibitions(exhibitions.filter((ex) => ex.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTheme("");
    setEditLocation("");
    setEditDate("");
    setEditArtworkId("");
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="exhibition-form">
          <h2>🏛️ Add New Exhibition</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <input
              id="theme"
              placeholder="Exhibition theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              placeholder="Exhibition location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artworkId">Artwork (Optional)</label>
            <select
              id="artworkId"
              value={artworkId}
              onChange={(e) => setArtworkId(e.target.value)}
            >
              <option value="">Select Artwork</option>
              {artworks.map((artwork) => (
                <option key={artwork.id} value={artwork.id}>
                  {artwork.title} (ID: {artwork.id})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            🏛️ Add Exhibition
          </button>
        </form>
      </div>

      <div className="cards-container">
        <h3>Exhibitions ({exhibitions.length})</h3>

        {exhibitions.length === 0 ? (
          <div className="empty-state">
            <p>No exhibitions found. Add one above!</p>
          </div>
        ) : (
          <div className="exhibition-cards">
            {exhibitions.map((ex) => (
              <div key={ex.id} className="exhibition-card">
                {editingId === ex.id ? (
                  <div className="edit-mode">
                    <div className="edit-header">
                      <h4>Edit Exhibition</h4>
                    </div>
                    <div className="edit-form">
                      <input
                        value={editTheme}
                        onChange={(e) => setEditTheme(e.target.value)}
                        placeholder="Theme"
                        required
                      />
                      <input
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="Location"
                        required
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        required
                      />
                      <select
                        value={editArtworkId}
                        onChange={(e) => setEditArtworkId(e.target.value)}
                      >
                        <option value="">Select Artwork</option>
                        {artworks.map((artwork) => (
                          <option key={artwork.id} value={artwork.id}>
                            {artwork.title} (ID: {artwork.id})
                          </option>
                        ))}
                      </select>
                      <div className="edit-actions">
                        <button
                          onClick={() => handleUpdate(ex.id)}
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
                    <div className="exhibition-content">
                      <div className="exhibition-name">
                        <h4>{ex.theme || "N/A"}</h4>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">
                          {ex.location || "N/A"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">
                          {ex.date
                            ? new Date(ex.date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      {ex.artwork_id && (
                        <div className="detail-item">
                          <span className="detail-label">Artwork ID:</span>
                          <span className="detail-value">{ex.artwork_id}</span>
                        </div>
                      )}
                    </div>

                    <div className="exhibition-actions">
                      <button
                        onClick={() => handleEdit(ex)}
                        className="action-button edit-button"
                        title="Edit Exhibition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ex.id)}
                        className="action-button delete-button"
                        title="Delete Exhibition"
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
