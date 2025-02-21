"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Plus } from "lucide-react"
import AddMovieModal from "./AddMovieModal"
import type React from "react"

// Interfaces para soportar ambos formatos de movie
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
}

export default function Hero({ movie, refreshTrigger, setRefreshTrigger }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)               // Estado para controlar la acción de agregar
  const [addProgress, setAddProgress] = useState(0)               // Progreso de la operación
  const [addError, setAddError] = useState<string | null>(null)   // Error en caso de fallo
  const [addSuccess, setAddSuccess] = useState(false)             // Indicador de éxito
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Determinar la imagen de fondo y el título según el origen de la película
  const backgroundImage =
    "fields" in movie
      ? movie.fields.poster_url || ""
      : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

  const movieTitle = "fields" in movie ? movie.fields.movie_name : movie.title

  // Para animar el cambio de imagen de fondo
  const [image, setImage] = useState(backgroundImage)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setImage(backgroundImage)
    }, 100)
    return () => clearTimeout(timeout)
  }, [backgroundImage])

  // Función para agregar la película a Airtable
  // Si la película ya viene de Airtable (tiene "fields"), se considera ya agregada y se muestra un mensaje.
  // Para películas de TMDB, se envía un payload JSON directamente.
  const handleAddToList = async () => {
    setAddError(null)
    setIsAdding(true)
    try {
      if ("fields" in movie) {
        // La película ya está en la lista, no se vuelve a insertar.
        setAddSuccess(true)
        setTimeout(() => {
          setIsAdding(false)
          setAddProgress(0)
          setAddSuccess(false)
        }, 2000)
        return
      }
      
      // Validar que la URL de la imagen sea válida
      if (!backgroundImage || !backgroundImage.startsWith("http")) {
        throw new Error("URL de imagen inválida")
      }
      
      console.log("Enviando payload para TMDB:", { movie_name: movieTitle, poster_url: backgroundImage })
      
      // Simulación de progreso
      let progress = 0
      const interval = setInterval(() => {
        progress += 1
        setAddProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 30)
      
      // Enviar la petición POST con payload JSON
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_name: movieTitle,
          poster_url: backgroundImage,
        }),
      })
      
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al agregar la película")
      }
      
      setAddSuccess(true)
      setRefreshTrigger(prev => prev + 1) // Actualiza para recargar el Sidebar
      setTimeout(() => {
        setIsAdding(false)
        setAddProgress(0)
        setAddSuccess(false)
      }, 2000)
      
    } catch (error) {
      console.error("Error al agregar la película:", error)
      setAddError(error instanceof Error ? error.message : "Ocurrió un error desconocido")
      setIsAdding(false)
    }
  }

  const handleMovieAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
      <div className="relative h-screen" ref={contentRef}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
          {/* Imagen de fondo animada con zoom in/out */}
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          {/* Gradiente superior para fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

          {/* Versión Desktop (visible en sm en adelante) */}
          <div className="hidden sm:block">
            {/* Contenido (texto y título) */}
            <div className="absolute bottom-64 left-16 z-10 transition-all duration-300">
              <motion.p
                key={movieTitle + "-original"}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="text-xl tracking-[.25em] mb-2 font-bebas-neue leading-none"
              >
                <span className="font-book">ORIGINAL DE </span>
                <span className="font-bold">NETFLIX</span>
              </motion.p>
              <motion.h1
                key={movieTitle + "-title"}
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
                onClick={handleAddToList}
                aria-label="Agregar a Mi Lista"
                disabled={isAdding}
              >
                <Plus className="w-4 h-4" />
                <span className="leading-[0]">MI LISTA</span>
                {isAdding && <span className="ml-2 text-sm">{addProgress}%</span>}
              </button>
            </motion.div>
          </div>

          {/* Versión Mobile (solo en resoluciones sm y abajo) */}
          <div className="sm:hidden absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-10">
            <motion.p
              key={movieTitle + "-original-mobile"}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-xl tracking-[.25em] mb-2 font-bebas-neue leading-none"
            >
              <span className="font-book">ORIGINAL DE </span>
              <span className="font-bold">NETFLIX</span>
            </motion.p>
            <motion.h1
              key={movieTitle + "-title-mobile"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-7xl font-bold tracking-widest text-primary leading-none font-bebas-neue"
            >
              {movieTitle}
            </motion.h1>
            <div className="w-full max-w-xs mt-8 space-y-4">
              <button
                type="button"
                className="text-lg btn-primary flex items-center justify-center tracking-[.25em] gap-2 h-14 w-full text-center font-bebas-neue"
                aria-label="Reproducir"
              >
                <Play className="w-4 h-4" />
                <span className="leading-[0]">REPRODUCIR</span>
              </button>
              <button
                type="button"
                className="text-lg btn-secondary flex items-center justify-center tracking-[.25em] h-14 w-full gap-2 font-bebas-neue"
                onClick={handleAddToList}
                aria-label="Agregar a Mi Lista"
                disabled={isAdding}
              >
                <Plus className="w-4 h-4" />
                <span className="leading-[0]">MI LISTA</span>
                {isAdding && <span className="ml-2 text-sm">{addProgress}%</span>}
              </button>
            </div>
          </div>

          {/* Mensajes opcionales */}
          {addError && (
            <div className="absolute bottom-32 left-16 text-red-500 font-bebas-neue">
              {addError}
            </div>
          )}
          {addSuccess && (
            <div className="absolute bottom-10 left-16 text-[#64eebc] font-bebas-neue">
              ¡PELÍCULA AGREGADA!
            </div>
          )}
        </motion.div>
      </div>

      <AddMovieModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onMovieAdded={handleMovieAdded} />
    </>
  )
}
