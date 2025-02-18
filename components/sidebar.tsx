"use client"

import { motion } from "framer-motion"
import { CirclePlay, Star, Check } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import Select, { components } from "react-select"

// Nueva interfaz para las películas de Airtable
interface AirtableMovie {
  id: string
  fields: {
    movie_name: string
    poster_url?: string
  }
}

interface TMDBMovie {
  id: number
  title: string
  backdrop_path: string
  poster_path: string
}

interface SidebarProps {
  popularMovies: TMDBMovie[]
  topRatedMovies: TMDBMovie[]
  upcomingMovies: TMDBMovie[]
  onMovieSelect: (movie: TMDBMovie | AirtableMovie) => void
}

export default function Sidebar({ popularMovies, topRatedMovies, upcomingMovies, onMovieSelect }: SidebarProps) {
  const [category, setCategory] = useState<"popular" | "top_rated" | "upcoming" | "mymovies">("popular")
  const [selectedOption, setSelectedOption] = useState<{ label: string; value: "popular" | "top_rated" | "upcoming" | "mymovies" } | null>(null)

  const movies = {
    popular: popularMovies,
    top_rated: topRatedMovies,
    upcoming: upcomingMovies
  }

  const options: { label: string; value: "popular" | "top_rated" | "upcoming" | "mymovies"}[] = [
    { label: "Populares", value: "popular" },
    { label: "Top", value: "top_rated" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Mis Películas", value: "mymovies" }
  ]

  // Estados para "Mis Películas" (datos de Airtable)
  const [myMovies, setMyMovies] = useState<AirtableMovie[]>([])
  const [isLoadingMyMovies, setIsLoadingMyMovies] = useState(false)

  // Función para obtener "Mis Películas" desde Airtable (API)
  const fetchMyMovies = useCallback(async () => {
    setIsLoadingMyMovies(true)
    try {
      const response = await fetch("/api/movies")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMyMovies(data.records || [])
    } catch (error) {
      console.error("Error fetching my movies:", error)
      setMyMovies([])
    } finally {
      setIsLoadingMyMovies(false)
    }
  }, [])

  // useEffect para cargar "Mis Películas" al seleccionar esa categoría
  useEffect(() => {
    if (category === "mymovies") {
      fetchMyMovies()
    }
  }, [category, fetchMyMovies])

  // Definir qué películas mostrar y el estado de carga según la categoría
  const displayMovies = category === "mymovies" ? myMovies : movies[category]
  const loading = category === "mymovies" ? isLoadingMyMovies : false

  const CustomMenu = (props: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="absolute z-50 w-full bg-transparent rounded-lg p-2"
      >
        <components.Menu {...props}>{props.children}</components.Menu>
      </motion.div>
    )
  }

  // Componente interno para cada movie card
  const MovieCard = ({ movie }: { movie: any }) => {
    const [hovered, setHovered] = useState(false)
    return (
      <motion.div
        key={movie.id}
        className="relative group cursor-pointer py-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onMovieSelect(movie)}
      >
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {/* Imagen de la película */}
          <img
            src={
              category === "mymovies"
                ? movie.fields.poster_url || "/placeholder.svg?height=169&width=300"
                : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }
            alt={category === "mymovies" ? movie.fields.movie_name : movie.title}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Grupo de icono de play y título */}
          <motion.div
            animate={{
              flexDirection: hovered ? "row" : "column",
              scale: hovered ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-7 left-0 right-0 ${
              hovered ? "flex flex-row items-center justify-center gap-2" : "flex flex-col items-center justify-center gap-1"
            } text-center`}
          >
            <CirclePlay
              size={38}
              strokeWidth={0.5}
              style={{ fill: "#242424", fillOpacity: 0.5 }}
              className="text-white group-hover:text-primary transition-colors duration-300"
            />
            <h3 className="text-md font-regular text-white font-bebas-neue tracking-widest leading-tight">
            {
              category === "mymovies"
                ? (movie.fields.movie_name.length > 15 
                    ? movie.fields.movie_name.slice(0, 15) + "..." 
                    : movie.fields.movie_name)
                : (movie.title.length > 15 
                    ? movie.title.slice(0, 15) + "..." 
                    : movie.title)
            }
            </h3>
          </motion.div>

          {/* Elemento de rating (estrella + 5.0) en la esquina inferior izquierda */}
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-[#64eebc] text-[#64eebc]" />
              <span className="ml-1 text-white text-sm">5.0</span>
            </div>
          </div>

          {/* Elemento de año en la esquina inferior derecha */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm">2020</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="fixed top-28 right-10 w-64 h-[690px] bg-transparent font-bebas-neue font-medium rounded-lg z-50">
      {/* Encabezado fijo */}
      <div className="sticky top-0 bg-transparent z-10 mb-4">
        <Select
          options={options}
          value={selectedOption}
          onChange={(selected: { label: string; value: "popular" | "top_rated" | "upcoming" | "mymovies" } | null) => {
            setSelectedOption(selected)
            setCategory(selected?.value || "popular")
          }}
          placeholder="Escoge una opción"
          getOptionLabel={(e) => e.label}
          formatOptionLabel={(data, { context }) =>
            context === "menu" ? (
              <div className="flex justify-between items-center w-full">
                <span className="font-book tracking-[0.3em]">{data.label}</span>
                {selectedOption?.value === data.value && <Check className="w-5 h-5 text-white" />}
              </div>
            ) : (
              <span className="text-lg font-bold">
                <span className="font-bebas-neue font-medium">Ver: </span>
                {data.label}
              </span>
            )
          }
          className="text-white tracking-[0.2em] flex justify-center items-center"
          menuPortalTarget={document.body}
          menuPosition="absolute"
          components={{
            Menu: CustomMenu,
          }}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              width: "100%",
              cursor: "pointer",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#242424",
              borderRadius: "0px",
              border: "none",
              color: "white",
              padding: "10px 20px",
              position: "absolute",
              width: "241px",
              "::before": {
                backgroundColor:"transparent",
                content: '""',
                position: "absolute",
                top: "-10px",
                right: "28px",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid #242424",
              },
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 99999,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: "transparent",
              color: "white",
              cursor: "pointer",
              width: "100%",
              fontFamily: "Bebas Neue",
              fontWeight: state.isFocused ? "700" : "400",
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
            placeholder: (base) => ({
              ...base,
              color: "white",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: "0",
              marginLeft: "-14px",
              color: "white",
              ":hover": { color: "white" },
              ":focus": { color: "white" },
              ":active": { color: "white" },
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              color: "white",
              ":hover": { color: "white" },
              ":focus": { color: "white" },
              ":active": { color: "white" },
            }),
          }}
        />
      </div>
      {/* Lista de películas scrollable */}
      <div className="px-6 pb-6 overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#64eebc]"></div>
          </div>
        ) : (
          <>
            {displayMovies && displayMovies.length > 0 ? (
              displayMovies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p className="text-white text-center">No hay películas disponibles.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
