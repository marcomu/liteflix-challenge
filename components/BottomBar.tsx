"use client";

import { useState, useEffect } from "react";

export default function BottomBar() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.records))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-900 p-4">
      {movies.map((movie: any) => (
        <p key={movie.id}>{movie.fields.movie_name}</p>
      ))}
    </div>
  );
}
