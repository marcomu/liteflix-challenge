"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Sidebar from "@/components/sidebar";
import BottomBar from "@/components/BottomBar";

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<any>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY`);
        const data = await res.json();
        setPopularMovies(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMovies();
  }, []);

  if (!popularMovies) return <p className="text-white">Cargando...</p>;

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
