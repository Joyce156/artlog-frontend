import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, profile_picture: profilePicture }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }

      onLoginSuccess(username, profilePicture); // pass both username & picture
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2 style={{ color: "#fff" }}>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Profile Picture URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
