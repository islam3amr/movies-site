import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Movie from "./pages/Movie.jsx";
import Watch from "./pages/Watch.jsx";
import Favorites from "./pages/Favorites.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
}
