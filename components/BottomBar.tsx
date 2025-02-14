"use client"

import { useState, useEffect, useCallback } from "react"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BottomBarProps {
  isVisible: boolean
  refreshTrigger: number
}

interface Movie {
  id: string
  fields: {
    movie_name: string
    poster_url?: string
  }
}

export default function BottomBar({ isVisible, refreshTrigger }: BottomBarProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMovies = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/movies")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMovies(data.records || [])
    } catch (error) {
      console.error("Error fetching movies:", error)
      setMovies([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isVisible || refreshTrigger) {
      fetchMovies()
    }
  }, [isVisible, refreshTrigger, fetchMovies])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-[#242424] p-4 z-50"
          style={{ height: "20vh", overflowY: "auto" }}
        >
          <h2 className="text-[#64eebc] text-xl font-bold mb-4 font-bebas-neue">MI LISTA</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#64eebc]"></div>
            </div>
          ) : (
            <>
              {movies && movies.length > 0 ? (
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
                      <p className="text-white text-sm mt-2 truncate font-bebas-neue">{movie.fields.movie_name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white text-center font-bebas-neue">No hay películas en tu lista.</p>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

