"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Sidebar from "@/components/sidebar";
import BottomBar from "@/components/BottomBar";
const NEXT_PUBLIC_TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;


export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<any>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${NEXT_PUBLIC_TMDB_API_KEY}`);
        const data = await res.json();
        setPopularMovies(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMovies();
  }, []);

  // ✅ Verifica si los datos han llegado antes de renderizar
  if (!popularMovies || !popularMovies.results || popularMovies.results.length === 0) {
    return <p className="text-white text-center">Cargando películas...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <div className="flex-grow">
          <Hero movie={popularMovies.results[0]} />
        </div>
        <Sidebar />
      </div>
      <BottomBar />
    </div>
  );
}
