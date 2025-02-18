"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Plus } from "lucide-react"
import AddMovieModal from "./AddMovieModal"
import type React from "react"

// Definición de interfaces para soportar ambos formatos de movie
interface TMDBMovie {
  title: string
  backdrop_path: string
}

interface AirtableMovie {
  fields: {
    movie_name: string
    poster_url?: string
  }
}

type Movie = TMDBMovie | AirtableMovie

interface HeroProps {
  movie: Movie
  refreshTrigger: number
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
  toggleBottomBar: () => void
}

export default function Hero({ movie, refreshTrigger, setRefreshTrigger, toggleBottomBar }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Determinar la imagen de fondo y el título según el tipo de movie
  const backgroundImage =
    "fields" in movie
      ? movie.fields.poster_url || ""
      : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

  const movieTitle = "fields" in movie ? movie.fields.movie_name : movie.title

  // Para lograr el efecto de animación al cambiar la imagen
  const [image, setImage] = useState(backgroundImage)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImage(backgroundImage)
    }, 100)
    return () => clearTimeout(timeout)
  }, [backgroundImage])

  const handleMovieAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <>
      <div className="relative h-screen" ref={contentRef}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
          
          {/* Imagen de fondo animada con zoom in/out */}
          <motion.div
            key={image} // Forzamos reanimación cuando la imagen cambia
            initial={{ opacity: 0, scale: 1.2 }} // Inicia con un breve zoom in
            animate={{ opacity: 1, scale: 1 }}      // Se aleja a escala normal
            transition={{ duration: 3, ease: "easeInOut" }} // Animación de 3 segundos
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />

          {/* Gradiente superior para fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

          {/* Contenido */}
          <div className="absolute bottom-64 left-16 z-10 transition-all duration-300">
            {/* ORIGINAL DE NETFLIX - Aparece desde arriba hacia abajo con ease */}
            <motion.p
              key={movieTitle + "-original"} //  Clave para reanimar cada cambio de película
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-xl tracking-[.25em] mb-2 font-bebas-neue leading-none"
            >
              <span className="font-book">ORIGINAL DE </span>
              <span className="font-bold">NETFLIX</span> {/* Cambiado a NETFLIX */}
            </motion.p>

            {/* TÍTULO DE LA PELÍCULA - Aparece desde abajo hacia arriba */}
            <motion.h1
              key={movieTitle + "-title"} // Clave para reanimar cada cambio de película
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-[120px] font-bold tracking-widest text-primary leading-none font-bebas-neue"
            >
              {movieTitle}
            </motion.h1>
          </div>

          {/* Botones de acción */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeInOut" }}
            className="absolute bottom-48 left-16 flex gap-4"
          >
            <button
              type="button"
              className="text-lg btn-primary flex items-center justify-center tracking-[.25em] gap-2 h-14 w-[248px] text-center font-bebas-neue"
              aria-label="Reproducir"
            >
              <Play className="w-4 h-4" />
              <span className="leading-[0]">REPRODUCIR</span>
            </button>
            <button
              type="button"
              className="text-lg btn-secondary flex items-center justify-center tracking-[.25em] h-14 w-[248px] gap-2 font-bebas-neue"
              onClick={toggleBottomBar}
              aria-label="Mostrar mi lista"
            >
              <Plus className="w-4 h-4" />
              <span className="leading-[0]">MI LISTA</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      <AddMovieModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onMovieAdded={handleMovieAdded} />
    </>
  );
}
