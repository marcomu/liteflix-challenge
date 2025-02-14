"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useState } from "react"
import Select from "react-select";


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
  // Estado correcto para manejar la categoría seleccionada
  const [category, setCategory] = useState<"popular" | "top_rated" | "upcoming">("popular");

  // Estado correcto para manejar la opción seleccionada en el select
  const [selectedOption, setSelectedOption] = useState<{ label: string; value: "popular" | "top_rated" | "upcoming" } | null>(null);

  const movies = {
    popular: popularMovies,
    top_rated: topRatedMovies,
    upcoming: upcomingMovies,
  }

  const options = [
    { label: "Populares", value: "popular" },
    { label: "Top", value: "top_rated" },
    { label: "Upcoming", value: "upcoming" }
  ];

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
        font-bebas-neue
        z-50
      "
    >
      {/* Encabezado */}
      <div className="mb-4">
        <Select
          options={options}
          value={selectedOption} // ✅ Ahora el valor seleccionado se mantiene
          onChange={(selected) => {
            setSelectedOption(selected); // Guarda la opción seleccionada en el estado
            setCategory(selected?.value || "popular"); // Actualiza la categoría de películas
          }}
          placeholder="Escoge una opción"
          getOptionLabel={(e) => e.label} // ✅ Muestra solo "Populares", "Top", "Upcoming" en el menú
          formatOptionLabel={(data, { context }) =>
            context === "menu" ? (
              data.label // 🔹 En el menú, solo muestra "Populares", "Top", "Upcoming"
            ) : (
              <span className="text-lg font-bold">
                <span className="font-bebas-neue font-medium">Ver: </span>
                {data.label}
              </span>
            )

          }
          className="text-white tracking-[0.2em] flex justify-center items-center"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              boxShadow: "none", 
              display: "flex",
              alignItems: "center",
              gap: "4px", 
              padding: "4px 8px", 
              width: "100%",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#242424",
              borderRadius: "0px",
              border: "none",
              color: "white",
              padding: "10px 20px",
              top: "30px",
              position: "relative", // ✅ Necesario para el triángulo
              "::before": {
                content: '""',
                position: "absolute",
                top: "-10px", // 📌 Posición del triángulo
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid #242424", // 📌 Color del triángulo igual al menú
              },
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: "#242424",
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
              padding: "0", // 📌 Elimina espacio innecesario
              marginLeft: "-14px", // 📌 Mueve la flecha más cerca del texto
              color: "white",
              ":hover": { color: "white" },
              ":focus": { color: "white" },
              ":active": { color: "white" },
            }),
            indicatorSeparator: () => ({ // ❌ Elimina la barra separadora
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

      {/* Lista de películas */}
      <div className="space-y-6">
        {movies[category] && movies[category].length > 0 ? (
          movies[category].map((movie) => (
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
              <h3 className="mt-2 text-sm font-medium text-white text-shadow font-bebas-neue">
                {movie.title}
              </h3>
            </motion.div>
          ))
        ) : (
          <p className="text-white">No hay películas disponibles.</p> 
        )}
      </div>
    </div>
  )
}
