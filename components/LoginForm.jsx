import React, { useState } from "react";

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    const finalProfilePicture =
      profilePicture ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(username) +
        "&background=random";

    try {
      const response = await fetch(
        "https://artlog-backend.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            profile_picture: finalProfilePicture,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      onLoginSuccess(data.username, data.profile_picture);
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>👤</div>
          <h2>Welcome to Art-log</h2>
          <p>Log in to manage your art collection</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">
              Profile Picture URL (Optional)
              <button
                type="button"
                onClick={togglePreview}
                className="preview-toggle"
              >
                {previewVisible ? " Hide Preview" : " Show Preview"}
              </button>
            </label>
            <input
              id="profilePicture"
              type="text"
              placeholder="Enter image URL or leave blank for auto-generated"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>

          {previewVisible && profilePicture && (
            <div className="preview-container">
              <p>Preview:</p>
              <img
                src={profilePicture}
                alt="Profile preview"
                className="profile-preview"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div className="preview-error" style={{ display: "none" }}>
                Unable to load image
              </div>
            </div>
          )}

          <button type="submit" className="login-button">
            🔑 Log In
          </button>
        </form>

        <div className="login-footer">
          <p className="hint">
            💡 Tip: You can use any username. Profile picture will be
            auto-generated if no URL is provided.
          </p>
        </div>
      </div>
    </div>
  );
}
