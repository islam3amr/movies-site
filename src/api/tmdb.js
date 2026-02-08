const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function request(path) {
  const url = `${BASE_URL}${path}&api_key=${API_KEY}`;

  console.log("Fetching:", url);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "TMDB API Error");
  }
  return res.json();
}

export const tmdb = {
  trending: () =>
    request("/trending/movie/week?language=en-US"),

  popular: () =>
    request("/movie/popular?language=en-US&page=1"),

  arabic: () =>
    request("/discover/movie?language=ar&with_original_language=ar&page=1"),

  movieDetails: (id) =>
    request(`/movie/${id}?language=en-US`),

  movieVideos: (id) =>
    request(`/movie/${id}/videos?language=en-US`),

  search: (query) =>
    request(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`),

  // ✅ مهم لصفحة المشاهدة (Where to Watch)
  watchProviders: (id) =>
    request(`/movie/${id}/watch/providers`)
};
