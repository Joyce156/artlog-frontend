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
      const response = await fetch("http://localhost:8000/artists/");
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
      const response = await fetch("http://localhost:8000/artists/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, country, art_style: artStyle }),
      });
      if (!response.ok) throw new Error("Failed to create artist");
      const newArtist = await response.json();
      setArtists([newArtist, ...artists]);
      setName("");
      setCountry("");
      setArtStyle("");
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
      const response = await fetch(`http://localhost:8000/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          country: editCountry,
          art_style: editArtStyle,
        }),
      });

      if (!response.ok) throw new Error("Failed to update artist");

      const updatedArtist = await response.json();
      setArtists(
        artists.map((artist) => (artist.id === id ? updatedArtist : artist))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/artists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete artist");

      setArtists(artists.filter((artist) => artist.id !== id));
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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Artist Form</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <input
          placeholder="Art Style"
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
          required
        />
        <button type="submit">Add Artist</button>
      </form>

      <div className="cards">
        {artists.map((artist) => (
          <div key={artist.id} className="card">
            {editingId === artist.id ? (
              <div className="edit-form">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <input
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  required
                />
                <input
                  value={editArtStyle}
                  onChange={(e) => setEditArtStyle(e.target.value)}
                  required
                />
                <div className="button-group">
                  <button onClick={() => handleUpdate(artist.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>{artist.name}</strong>
                </p>
                <p>{artist.country}</p>
                <p>{artist.art_style}</p>
                <div className="button-group">
                  <button onClick={() => handleEdit(artist)}>Edit</button>
                  <button
                    onClick={() => handleDelete(artist.id)}
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
