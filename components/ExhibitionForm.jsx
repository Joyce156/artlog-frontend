import React, { useState, useEffect } from "react";

export default function ExhibitionForm() {
  const [theme, setTheme] = useState(""); // Changed from name
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

  const fetchExhibitions = async () => {
    try {
      console.log("Fetching exhibitions...");
      const response = await fetch("http://localhost:8000/exhibitions/");
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data received:", data);
      setExhibitions(data);
      setError("");
    } catch (err) {
      console.error("Fetch error details:", err);
      setError(
        `Failed to fetch exhibitions: ${err.message}. Make sure backend is running on port 8000.`
      );
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/exhibitions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          theme, // Changed from name
          date,
          artwork_id: artworkId ? parseInt(artworkId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Failed to create exhibition. Status: ${response.status}`
        );
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
      const response = await fetch(`http://localhost:8000/exhibitions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: editLocation,
          theme: editTheme,
          date: editDate,
          artwork_id: editArtworkId ? parseInt(editArtworkId) : null,
        }),
      });

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
      const response = await fetch(`http://localhost:8000/exhibitions/${id}`, {
        method: "DELETE",
      });

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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Exhibition Form</h2>
        {error && (
          <div
            style={{
              color: "red",
              background: "#ffebee",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        )}
        <input
          placeholder="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          placeholder="Artwork ID (optional)"
          type="number"
          value={artworkId}
          onChange={(e) => setArtworkId(e.target.value)}
        />
        <button type="submit">Add Exhibition</button>
      </form>

      <div className="cards">
        {exhibitions.length === 0 ? (
          <p>No exhibitions found. Add one above!</p>
        ) : (
          exhibitions.map((ex) => (
            <div key={ex.id} className="card">
              {editingId === ex.id ? (
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
                  <input
                    placeholder="Artwork ID (optional)"
                    type="number"
                    value={editArtworkId}
                    onChange={(e) => setEditArtworkId(e.target.value)}
                  />
                  <div className="button-group">
                    <button onClick={() => handleUpdate(ex.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p>
                    <strong>Theme: {ex.theme || "N/A"}</strong>
                  </p>
                  <p>Location: {ex.location || "N/A"}</p>
                  <p>
                    Date:{" "}
                    {ex.date ? new Date(ex.date).toLocaleDateString() : "N/A"}
                  </p>
                  {ex.artwork_id && <p>Artwork ID: {ex.artwork_id}</p>}
                  <div className="button-group">
                    <button onClick={() => handleEdit(ex)}>Edit</button>
                    <button
                      onClick={() => handleDelete(ex.id)}
                      style={{ backgroundColor: "#ff4444", color: "white" }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
