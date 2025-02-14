"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";

interface Movie {
  id: string;
  fields: {
    movie_name: string;
    poster_url?: string;
  };
}

export default function BottomBar() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.records))
      .catch((err) => console.error(err));
  }, []);

  if (!isClient) return <p className="text-white">Cargando...</p>;

  return (
    <div className="bg-[#242424] p-4">
      <h2 className="text-[#64eebc] text-xl font-bold mb-4">MI LISTA</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-48">
            <div className="aspect-video bg-[#333333] rounded-lg overflow-hidden relative group">
              <img
                src={movie.fields.poster_url || "/placeholder.svg?height=169&width=300"}
                alt={movie.fields.movie_name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-white text-sm mt-2 truncate">{movie.fields.movie_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
