const API_KEY = import.meta.env.VITE_TMDB_KEY;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const BASE = "https://api.themoviedb.org/3";

async function request(path) {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${API_KEY || ""}`;

  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.status_message || "TMDB request failed");
  return data;
}
export async function getMovieTrailer(movieId) {
  try {
    const videos = await tmdb.videos(movieId);
    const trailer = videos.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    return trailer?.key || null;
  } catch (error) {
    console.error("Failed to fetch trailer:", error);
    return null;
  }
}
export const tmdb = {
  trending: () => request("/trending/movie/week?language=en-US&page=1"),
  popular: () => request("/movie/popular?language=en-US&page=1"),
  search: (q) => request(`/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`),
  videos: (id) => request(`/movie/${id}/videos?language=en-US`),
  watchProviders: (id) => request(`/movie/${id}/watch/providers`),
};

