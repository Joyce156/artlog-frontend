import React from "react";

export default function Home({ user }) {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>Hello, {user.username}!</h2>
      <img
        src={user.profilePicture}
        alt="Profile"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          marginTop: "20px",
        }}
      />
      <p>
        Welcome to Art-log! Discover and log amazing artworks and exhibitions
      </p>

      <p style={{ marginTop: "10px" }}>
        Use the navigation above to explore more.
      </p>
    </div>
  );
}
