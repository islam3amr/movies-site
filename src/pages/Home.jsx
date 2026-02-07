import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const KEY = import.meta.env.VITE_TMDB_KEY;

console.log("TMDB KEY:", import.meta.env.VITE_TMDB_KEY);
console.log("COUNTRY:", import.meta.env.VITE_COUNTRY);


const FEEDS = {
  trending: (page=1) =>
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&page=${page}`,
  popular: (page=1) =>
    `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&page=${page}`,
  arabic: (page=1) =>
    `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&language=ar&with_original_language=ar&sort_by=popularity.desc&page=${page}`,
};

function loadFavs() {
  try { return JSON.parse(localStorage.getItem("favs") || "[]"); }
  catch { return []; }
}
function saveFavs(list) {
  localStorage.setItem("favs", JSON.stringify(list));
}

export default function Home() {
  const [feed, setFeed] = useState("trending");
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [favs, setFavs] = useState(loadFavs());
  const favIds = useMemo(() => new Set(favs.map(m => m.id)), [favs]);

  async function loadFeed(newFeed = feed) {
  setLoading(true);
  try {
    let url = "";

    if (newFeed === "trending") {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&page=1`;
    } 
    else if (newFeed === "popular") {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&page=1`;
    } 
    else if (newFeed === "arabic") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&language=ar&with_original_language=ar&sort_by=popularity.desc&page=1`;
    }

    console.log("Fetching:", url); // تشخيص

    const res = await fetch(url);

    const text = await res.text();
    try {
      const data = JSON.parse(text); // نحاول نحوله لـ JSON يدويًا

      const list = data.results || [];
      setMovies(list);
      setHero(list.find(m => m.backdrop_path) || list[0] || null);
    } catch {
      console.error("Response was not JSON:", text.slice(0, 200));
      alert("TMDB لم يرجع بيانات صحيحة. راجع Console.");
      setMovies([]);
      setHero(null);
    }
  } catch (e) {
    console.error(e);
    alert("Error: " + e.message);
  } finally {
    setLoading(false);
  }
}


  async function search() {
  if (!q.trim()) return loadFeed(feed);

  setLoading(true);
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${encodeURIComponent(q)}&page=1`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.status_message || "TMDB error");
    }

    const list = data.results || [];
    setMovies(list);
    setHero(list.find(m => m.backdrop_path) || list[0] || null);
  } catch (e) {
    console.log(e);
    alert("API Error: " + e.message);
    setMovies([]);
    setHero(null);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { loadFeed("trending"); }, []);

  function toggleFav(movie) {
    const exists = favIds.has(movie.id);
    const next = exists ? favs.filter(m => m.id !== movie.id) : [movie, ...favs];
    setFavs(next);
    saveFavs(next);
  }

  const heroBg = hero?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${hero.backdrop_path}`
    : "";

  return (
    <main className="container">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button
          className={`btn ${feed === "trending" ? "" : "btnGhost"}`}
          onClick={() => { setFeed("trending"); setQ(""); loadFeed("trending"); }}
        >
          Trending
        </button>

        <button
          className={`btn ${feed === "popular" ? "" : "btnGhost"}`}
          onClick={() => { setFeed("popular"); setQ(""); loadFeed("popular"); }}
        >
          Popular
        </button>

        <button
          className={`btn ${feed === "arabic" ? "" : "btnGhost"}`}
          onClick={() => { setFeed("arabic"); setQ(""); loadFeed("arabic"); }}
        >
          Arabic
        </button>
      </div>

      {/* Search */}
      <div className="searchRow" style={{ marginTop: 0 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies..."
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button className="btn" onClick={search}>Search</button>
      </div>

      {/* HERO */}
      <section className="hero fullBleed">
        <div className="heroBg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="logo" style={{ fontSize: 40, marginBottom: 10 }}>نُ</div>

          <h1 className="heroTitle">{hero?.title || "Loading..."}</h1>

          <div className="pills">
            <span className="pill pillRed">⭐ {hero?.vote_average?.toFixed(1) ?? "—"}</span>
            <span className="pill">{hero?.release_date?.slice(0, 4) || "—"}</span>
            <span className="pill">{feed.toUpperCase()}</span>
          </div>

          <p className="heroSub">
            {hero?.overview
              ? (hero.overview.length > 160 ? hero.overview.slice(0, 160) + "..." : hero.overview)
              : ""}
          </p>

          {hero && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to={`/watch/${hero.id}`} className="btnPrimary">▶ WATCH NOW</Link>
              <Link to={`/movie/${hero.id}`} className="btn">Details</Link>
              <button className="btn btnGhost" onClick={() => toggleFav(hero)}>
                {favIds.has(hero.id) ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          )}
        </div>
      </section>

      <h2 className="sectionTitle">
        {feed === "trending" ? "Trending Movies" : feed === "popular" ? "Popular Movies" : "Arabic Movies"}
      </h2>

      {loading && <p className="sub">Loading...</p>}

      <section className="grid">
        {!loading && movies.map((m) => (
          <article className="card cardCompact" key={m.id}>
            <Link to={`/movie/${m.id}`}>
              {m.poster_path ? (
                <img className="poster" src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              ) : (
                <div className="placeholder">No Poster</div>
              )}
            </Link>

            <div className="cardBody">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <h3 className="title" style={{ flex: 1 }}>{m.title}</h3>
                <button className="btn btnGhost" onClick={() => toggleFav(m)} title="Favorite">
                  {favIds.has(m.id) ? "★" : "☆"}
                </button>
              </div>

              <div className="meta">
                <span>{m.release_date?.slice(0, 4) || "—"}</span>
                <span>•</span>
                <span>⭐ {m.vote_average?.toFixed(1) ?? "—"}</span>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link to={`/watch/${m.id}`} className="btn">▶ Trailer</Link>
                <Link to={`/movie/${m.id}`} className="btn btnGhost">Details</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
