// src/components/Navbar.jsx
export default function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <a onClick={() => setPage("home")}>Home</a>
      <a onClick={() => setPage("artist")}>Artist</a>
      <a onClick={() => setPage("artwork")}>Artwork</a>
      <a onClick={() => setPage("exhibition")}>Exhibition</a>
    </nav>
  );
}
