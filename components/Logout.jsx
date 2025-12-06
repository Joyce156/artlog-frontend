import React from "react";

export default function Logout({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <div className="logout-section">
      <div className="user-info">
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt={user.username}
            className="user-avatar"
          />
        )}
        <span className="username">👋 Hello, {user.username}!</span>
      </div>
      <button onClick={handleLogout} className="logout-button" title="Logout">
        🚪 Logout
      </button>
    </div>
  );
}
