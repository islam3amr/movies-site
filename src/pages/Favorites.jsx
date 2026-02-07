import { Link } from "react-router-dom";

function loadFavs() {
  try { return JSON.parse(localStorage.getItem("favs") || "[]"); }
  catch { return []; }
}

export default function Favorites() {
  const favs = loadFavs();

  return (
    <main className="container">
      <div className="h1">Favorites</div>
      <p className="sub">Your saved movies.</p>

      {favs.length === 0 && <p className="sub">No favorites yet.</p>}

      <section className="grid">
        {favs.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`}>
            <article className="card">
              {m.poster_path ? (
                <img
                  className="poster"
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                />
              ) : (
                <div className="placeholder">No Poster</div>
              )}
              <div className="cardBody">
                <h3 className="title">{m.title}</h3>
                <div className="meta">
                  <span>{m.release_date?.slice(0, 4) || "—"}</span>
                  <span>•</span>
                  <span>⭐ {m.vote_average?.toFixed(1) ?? "—"}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
