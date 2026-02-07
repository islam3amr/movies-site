import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const KEY = import.meta.env.VITE_TMDB_KEY;
const COUNTRY = import.meta.env.VITE_COUNTRY || "EG";

export default function Watch() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [providers, setProviders] = useState(null);
  const [tmdbLink, setTmdbLink] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const vRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}`);
        const vData = await vRes.json();
        const trailer =
          (vData.results || []).find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          (vData.results || []).find((v) => v.site === "YouTube");
        setYoutubeKey(trailer?.key || "");

        const pRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${KEY}`);
        const pData = await pRes.json();
        const c = pData?.results?.[COUNTRY] || null;
        setProviders(c);
        setTmdbLink(c?.link || "");
      } catch (e) {
        console.log(e);
        setProviders(null);
        setYoutubeKey("");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const allProviders =
    providers
      ? [...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])]
      : [];

  const uniqueProviders = [];
  const seen = new Set();
  for (const p of allProviders) {
    if (!seen.has(p.provider_id)) {
      seen.add(p.provider_id);
      uniqueProviders.push(p);
    }
  }

  return (
    <main className="container">
      <Link to={`/movie/${id}`} className="sub">⬅ Back to details</Link>

      <h1 style={{ marginTop: 12 }}>▶ Watch</h1>
      {loading && <p className="sub">Loading...</p>}

      {!loading && (
        <>
          <h2 className="sectionTitle">Trailer</h2>
          {!youtubeKey ? (
            <p className="sub">مفيش تريلر متاح للفيلم ده على TMDB.</p>
          ) : (
            <div style={{ width: "100%", maxWidth: 980, aspectRatio: "16/9" }}>
              <iframe
                title="trailer"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeKey}?rel=0`}
                allowFullScreen
                style={{ border: 0, borderRadius: 16 }}
              />
            </div>
          )}

          <h2 className="sectionTitle" style={{ marginTop: 18 }}>
            Where to watch in {COUNTRY}
          </h2>

          {!providers ? (
            <p className="sub">TMDB مش لاقي منصّات مشاهدة مسجّلة للفيلم ده في {COUNTRY}.</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                {providers.flatrate?.length ? <span className="badge">Subscription</span> : null}
                {providers.rent?.length ? <span className="badge">Rent</span> : null}
                {providers.buy?.length ? <span className="badge">Buy</span> : null}
              </div>

              {uniqueProviders.length === 0 ? (
                <p className="sub">مفيش مزوّدين ظاهرين في {COUNTRY} للفيلم ده.</p>
              ) : (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {uniqueProviders.map((p) => (
                    <div
                      key={p.provider_id}
                      style={{
                        border: "1px solid var(--line)",
                        background: "rgba(255,255,255,.04)",
                        borderRadius: 14,
                        padding: 10,
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                      }}
                      title={p.provider_name}
                    >
                      {p.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          style={{ width: 34, height: 34, borderRadius: 10 }}
                        />
                      ) : null}
                      <span>{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 14 }}>
                <a
                  className="btn"
                  href={tmdbLink || `https://www.themoviedb.org/movie/${id}/watch`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open official links
                </a>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
