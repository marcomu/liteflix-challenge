"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface SidebarProps {
  popularMovies?: Movie[];
  topRatedMovies?: Movie[];
  upcomingMovies?: Movie[];
}

export default function Sidebar({ popularMovies = [], topRatedMovies = [], upcomingMovies = [] }: SidebarProps) {
  const [category, setCategory] = useState<"popular" | "top_rated" | "upcoming">("popular");

  const movies = {
    popular: popularMovies || [],
    top_rated: topRatedMovies || [],
    upcoming: upcomingMovies || [],
  };

  useEffect(() => {
    console.log("Categoría actual:", category);
    console.log("Películas disponibles:", movies[category]);
  }, [category]);

  return (
    <div className="w-80 h-auto bg-black bg-opacity-90 backdrop-blur-md p-6 rounded-lg fixed right-5 top-24 overflow-y-auto max-h-[80vh]">
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "popular" | "top_rated" | "upcoming")}
          className="w-full bg-transparent border border-white text-white p-2 rounded"
        >
          <option value="popular">Populares</option>
          <option value="top_rated">Mejor Calificadas</option>
          <option value="upcoming">Próximos Estrenos</option>
        </select>
      </div>

      <div className="space-y-4">
        {movies[category] && movies[category].length > 0 ? (
          movies[category].map((movie) => (
            <motion.div key={movie.id} whileHover={{ scale: 1.05 }} className="relative group">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-white text-shadow">{movie.title}</h3>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-center">No hay películas disponibles</p>
        )}
      </div>
    </div>
  );
}
