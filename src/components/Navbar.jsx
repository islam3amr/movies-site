import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <Link className="logo" to="/">نُ</Link>

      <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <NavLink to="/" end className={({isActive}) => isActive ? "badge" : "sub"}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={({isActive}) => isActive ? "badge" : "sub"}>
          ⭐ Favorites
        </NavLink>
      </nav>
    </header>
  );
}
