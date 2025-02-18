"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Sidebar from "@/components/sidebar"

interface TMDBMovie {
  id: number
  title: string
  backdrop_path: string
  poster_path: string
}

interface AirtableMovie {
  id: string
  fields: {
    movie_name: string
    poster_url?: string
  }
}

export type MovieType = TMDBMovie | AirtableMovie

interface MovieResponse {
  results: TMDBMovie[]
}

async function getMovies(category: string): Promise<MovieResponse> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=6f26fd536dd6192ec8a57e94141f8b20`)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function HomePage() {
  // Ahora el estado acepta MovieType
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null)
  const [popularMovies, setPopularMovies] = useState<MovieResponse | null>(null)
  const [topRatedMovies, setTopRatedMovies] = useState<MovieResponse | null>(null)
  const [upcomingMovies, setUpcomingMovies] = useState<MovieResponse | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function fetchMovies() {
      try {
        const popular = await getMovies("popular")
        const topRated = await getMovies("top_rated")
        const upcoming = await getMovies("upcoming")
        setPopularMovies(popular)
        setTopRatedMovies(topRated)
        setUpcomingMovies(upcoming)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMovies()
  }, [])

  const handleMovieAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleMovieSelect = (movie: MovieType) => {
    setSelectedMovie(movie)
  }

  if (!popularMovies || !topRatedMovies || !upcomingMovies) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header onMovieAdded={handleMovieAdded} />
      <div className="flex h-full">
        <div className="flex-grow">
          <Hero
            movie={selectedMovie || popularMovies.results[0]}
            refreshTrigger={refreshTrigger}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
        <Sidebar
          popularMovies={popularMovies.results.slice(0, 4)}
          topRatedMovies={topRatedMovies.results.slice(0, 4)}
          upcomingMovies={upcomingMovies.results.slice(0, 4)}
          onMovieSelect={(movie) => handleMovieSelect(movie)}
        />
      </div>
    </div>
  )
}
