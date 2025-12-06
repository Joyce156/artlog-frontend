import React, { useState } from "react";
import Login from "../components/LoginForm";
import Home from "../pages/Home";
import ArtistForm from "../components/ArtistForm";
import ArtworkForm from "../components/ArtworkForm";
import ExhibitionForm from "../components/ExhibitionForm";

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("home"); // default to home

  if (!user) {
    return (
      <Login
        onLoginSuccess={(username, profilePicture) =>
          setUser({ username, profilePicture })
        }
      />
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" onClick={() => setActivePage("home")}>
          Home
        </a>
        <a href="#artist" onClick={() => setActivePage("artist")}>
          Artist
        </a>
        <a href="#artwork" onClick={() => setActivePage("artwork")}>
          Artwork
        </a>
        <a href="#exhibition" onClick={() => setActivePage("exhibition")}>
          Exhibition
        </a>
        <span style={{ marginLeft: "auto", color: "#f0f0f0" }}>
          Logged in as: {user.username}
        </span>
      </nav>

      {/* Container for forms or home */}
      <div className="container">
        {activePage === "home" && <Home user={user} />}
        {activePage === "artist" && <ArtistForm />}
        {activePage === "artwork" && <ArtworkForm />}
        {activePage === "exhibition" && <ExhibitionForm />}
      </div>
    </div>
  );
}
