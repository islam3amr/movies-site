const API_KEY = import.meta.env.VITE_TMDB_KEY;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const BASE = "https://api.themoviedb.org/3";

async function request(path) {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${API_KEY || ""}`;

  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export const tmdb = {
  trending: () => request("/trending/movie/week?language=en-US&page=1"),
  popular: () => request("/movie/popular?language=en-US&page=1"),
  search: (q) => request(`/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`),
  videos: (id) => request(`/movie/${id}/videos?language=en-US`),
};
