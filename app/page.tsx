"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Sidebar from "@/components/sidebar"
import BottomBar from "@/components/BottomBar"

const NEXT_PUBLIC_TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

async function getMovies(category: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${NEXT_PUBLIC_TMDB_API_KEY}`)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<any>(null)
  const [topRatedMovies, setTopRatedMovies] = useState<any>(null)
  const [upcomingMovies, setUpcomingMovies] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(false)

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

  if (!popularMovies || !topRatedMovies || !upcomingMovies) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header onMovieAdded={handleMovieAdded} />
      <div className="flex h-full">
        <div className="flex-grow">
          <Hero
            movie={popularMovies.results[0]}
            refreshTrigger={refreshTrigger}
            setRefreshTrigger={setRefreshTrigger}
            toggleBottomBar={() => setIsBottomBarVisible((prev) => !prev)}
          />
        </div>
        <Sidebar
          popularMovies={popularMovies.results.slice(0, 4)}
          topRatedMovies={topRatedMovies.results.slice(0, 4)}
          upcomingMovies={upcomingMovies.results.slice(0, 4)}
        />
      </div>
      <BottomBar isVisible={isBottomBarVisible} refreshTrigger={refreshTrigger} />
    </div>
  )
}

