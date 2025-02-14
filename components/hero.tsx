"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Movie {
  title: string;
  backdrop_path: string;
}

export default function Hero({ movie }: { movie: Movie }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p className="text-white">Cargando...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute bottom-16 left-16">
        <h1 className="text-5xl font-bold text-primary">{movie.title}</h1>
      </div>
    </motion.div>
  );
}
