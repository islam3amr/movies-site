import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tmdb } from "../api/tmdb";

export default function Watch() {
  const { id } = useParams();
  const [providers, setProviders] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    
    const fetchData = async () => {
      try {
        // جلب المقطع الدعائي
        const videosData = await tmdb.videos(id);
        const trailerVideo = videosData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailerVideo) {
          setTrailer(trailerVideo.key);
        }
        
        // جلب مزودي المحتوى
        const providersData = await tmdb.watchProviders(id);
        setProviders(providersData);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const country = "EG";
  const countryData = providers?.results?.[country] || null;

  if (loading) return <div className="container"><h2>Loading...</h2></div>;
  if (err) return <div className="container"><pre style={{ color: "tomato" }}>{err}</pre></div>;

  return (
    <div className="container">
      <Link className="btn" to={`/movie/${id}`}>← Back to details</Link>

      {trailer && (
        <div style={{ marginTop: 20, marginBottom: 30 }}>
          <h2 className="sectionTitle" style={{ marginBottom: 12 }}>مقطع دعائي - Trailer</h2>
          <div style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 8,
            background: "#000"
          }}>
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 8
              }}
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Movie Trailer"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

      <h2 className="sectionTitle" style={{ marginTop: 18 }}>Where to watch</h2>

      {!countryData && (
        <div style={{ color: "rgba(255,255,255,.75)" }}>
          Not available in your region ({country}).
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
              No providers available for {country}.
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
