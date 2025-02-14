"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Plus } from "lucide-react"
import AddMovieModal from "./AddMovieModal"
import type React from "react"

interface Movie {
  title: string
  backdrop_path: string
}

interface HeroProps {
  movie: Movie
  refreshTrigger: number
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
  toggleBottomBar: () => void
}

export default function Hero({ movie, refreshTrigger, setRefreshTrigger, toggleBottomBar }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState(movie.backdrop_path);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImage(movie.backdrop_path)
    }, 100)
    return () => clearTimeout(timeout)
  }, [movie])

  const handleMovieAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <>
      <div className="relative h-screen" ref={contentRef}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
          
          {/* Imagen de fondo animada */}
          <motion.div
            key={image} // NO BORRAR / Forzamos para que la imagen cambie con animación cuando ya esta seleccionada
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${image})` }}
          />

          {/* Gradiente superior para fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

          {/* Contenido */}
          <div className="absolute bottom-64 left-16 z-10 transition-all duration-300">
            {/* ORIGINAL DE LITEFLIX - Aparece desde arriba */}
            <motion.p
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-xl tracking-[.25em] mb-2 font-bebas-neue leading-none"
            >
              <span className="font-book">ORIGINAL DE </span>
              <span className="font-bold">LITEFLIX</span>
            </motion.p>

            {/* TÍTULO DE LA PELÍCULA - Aparece desde abajo */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-[120px] font-bold tracking-widest text-primary leading-none font-bebas-neue"
            >
              {movie.title}
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
