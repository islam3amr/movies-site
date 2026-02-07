import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const KEY = import.meta.env.VITE_TMDB_KEY;

function loadFavs() {
  try { return JSON.parse(localStorage.getItem("favs") || "[]"); }
  catch { return []; }
}
function saveFavs(list) {
  localStorage.setItem("favs", JSON.stringify(list));
}

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const [favs, setFavs] = useState(loadFavs());
  const favIds = useMemo(() => new Set(favs.map(m => m.id)), [favs]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}`);
      const data = await res.json();
      setMovie(data);
    }
    load();
  }, [id]);

  function toggleFav() {
    if (!movie) return;
    const exists = favIds.has(movie.id);
    const next = exists ? favs.filter(m => m.id !== movie.id) : [movie, ...favs];
    setFavs(next);
    saveFavs(next);
  }

  if (!movie) return <main className="container"><p className="sub">Loading...</p></main>;

  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";
  const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "";

  return (
    <main className="container">
      <Link to="/" className="sub">⬅ Back</Link>

      <section className="hero" style={{ marginTop: 14, minHeight: "56vh" }}>
        <div className="heroBg" style={{ backgroundImage: `url(${backdrop || poster})` }} />
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1 className="heroTitle" style={{ fontSize: 46 }}>{movie.title}</h1>

          <div className="pills">
            <span className="pill pillRed">⭐ {movie.vote_average?.toFixed(1) ?? "—"}</span>
            <span className="pill">{movie.release_date?.slice(0, 4) || "—"}</span>
            <span className="pill">{movie.runtime ? `${movie.runtime} min` : "—"}</span>
          </div>

          <p className="heroSub">
            {movie.overview || "No overview available."}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to={`/watch/${movie.id}`} className="btnPrimary">▶ WATCH</Link>
            <button className="btn btnGhost" onClick={toggleFav}>
              {favIds.has(movie.id) ? "★ Saved" : "☆ Save"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
