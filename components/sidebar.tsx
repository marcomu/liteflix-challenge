"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useState } from "react"

interface Movie {
  id: number
  title: string
  poster_path: string
}

interface SidebarProps {
  popularMovies: Movie[]
  topRatedMovies: Movie[]
  upcomingMovies: Movie[]
}

export default function Sidebar({ popularMovies, topRatedMovies, upcomingMovies }: SidebarProps) {
  const [category, setCategory] = useState<"popular" | "top_rated" | "upcoming">("popular")

  const movies = {
    popular: popularMovies,
    top_rated: topRatedMovies,
    upcoming: upcomingMovies,
  }

  return (
    <div
      className="
        fixed 
        top-28
        right-10
        w-64
        h-[80vh]
        bg-black bg-opacity-0
        rounded-lg
        overflow-y-auto
        p-6
        z-50
      "
    >
      {/* Encabezado */}
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "popular" | "top_rated" | "upcoming")}
          className="w-full bg-transparent border border-white text-white p-2 rounded font-bebas-neue"
        >
          <option value="popular">POPULARES</option>
          <option value="top_rated">MEJOR CALIFICADAS</option>
          <option value="upcoming">PRÓXIMOS ESTRENOS</option>
        </select>
      </div>

      {/* Lista de películas */}
      <div className="space-y-6">
        {movies[category].map((movie) => (
          <motion.div key={movie.id} whileHover={{ scale: 1.05 }} className="relative group">
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12" />
              </div>
            </div>
            <h3 className="mt-2 text-sm font-medium text-white text-shadow font-bebas-neue">{movie.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

