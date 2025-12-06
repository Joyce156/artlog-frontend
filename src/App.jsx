import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import Logout from "../components/Logout";
import HomePage from "../pages/Home";
import ArtistForm from "../components/ArtistForm";
import ArtworkForm from "../components/ArtworkForm";
import ExhibitionForm from "../components/ExhibitionForm";

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("home");

  const handleLoginSuccess = (username, profilePicture) => {
    setUser({ username, profilePicture });
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage("home");
  };

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-links">
          <a
            href="#home"
            onClick={() => setActivePage("home")}
            className={activePage === "home" ? "active" : ""}
          >
            🏠 Home
          </a>
          <a
            href="#artist"
            onClick={() => setActivePage("artist")}
            className={activePage === "artist" ? "active" : ""}
          >
            🎨 Artists
          </a>
          <a
            href="#artwork"
            onClick={() => setActivePage("artwork")}
            className={activePage === "artwork" ? "active" : ""}
          >
            🖼️ Artworks
          </a>
          <a
            href="#exhibition"
            onClick={() => setActivePage("exhibition")}
            className={activePage === "exhibition" ? "active" : ""}
          >
            🏛️ Exhibitions
          </a>
        </div>

        <Logout user={user} onLogout={handleLogout} />
      </nav>

      {/* Main content */}
      <div className="main-content">
        {activePage === "home" && <HomePage user={user} />}
        {activePage === "artist" && <ArtistForm />}
        {activePage === "artwork" && <ArtworkForm />}
        {activePage === "exhibition" && <ExhibitionForm />}
      </div>
    </div>
  );
}
