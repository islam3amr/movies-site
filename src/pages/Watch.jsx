import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tmdb } from "../api/tmdb";

export default function Watch() {
  const { id } = useParams();
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");

    tmdb.watchProviders(id)
      .then((data) => setProviders(data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const country = "EG"; // أو لو عندك env استخدمه
  const countryData = providers?.results?.[country] || null;

  // TMDB بيرجع لينك "tmdb://..." مش Web دايمًا — فهنستخدم صفحة TMDB كحل ثابت:
  const tmdbWebLink = `https://www.themoviedb.org/movie/${id}/watch`;

  if (loading) return <div className="container"><h2>Loading...</h2></div>;
  if (err) return <div className="container"><pre style={{ color: "tomato" }}>{err}</pre></div>;

  return (
    <div className="container">
      <Link className="btn" to={`/movie/${id}`}>← Back to details</Link>

      <h2 className="sectionTitle" style={{ marginTop: 18 }}>Where to watch</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <a className="btn" href={tmdbWebLink} target="_blank" rel="noreferrer">
          Open on TMDB
        </a>
      </div>

      {!countryData && (
        <div style={{ color: "rgba(255,255,255,.75)" }}>
          Not available in your region ({country}) — try TMDB link above.
        </div>
      )}

      {countryData && (
        <div style={{ display: "grid", gap: 14 }}>
          {countryData.flatrate?.length > 0 && (
            <ProviderRow title="Stream" items={countryData.flatrate} />
          )}
          {countryData.rent?.length > 0 && (
            <ProviderRow title="Rent" items={countryData.rent} />
          )}
          {countryData.buy?.length > 0 && (
            <ProviderRow title="Buy" items={countryData.buy} />
          )}

          {(!countryData.flatrate?.length && !countryData.rent?.length && !countryData.buy?.length) && (
            <div style={{ color: "rgba(255,255,255,.75)" }}>
              No providers list returned for {country}. Use TMDB button above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProviderRow({ title, items }) {
  return (
    <div>
      <div className="sectionTitle">{title}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {items.map((p) => (
          <div
            key={p.provider_id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,.10)",
              background: "rgba(255,255,255,.06)",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
              alt={p.provider_name}
              style={{ width: 30, height: 30, borderRadius: 10 }}
            />
            <div style={{ fontWeight: 700 }}>{p.provider_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
