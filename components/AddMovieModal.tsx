"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMovieModal({ isOpen, onClose }: AddMovieModalProps) {
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !poster) {
      alert("Por favor, ingresa un título y sube un póster.");
      return;
    }
    console.log("Película agregada:", title);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Agregar Película</h2>
              <button onClick={onClose} className="text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="block text-white">Título:</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white p-2 rounded mt-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="block text-white mt-4">Póster:</label>
              <input
                type="file"
                className="w-full bg-gray-800 text-white p-2 rounded mt-2"
                onChange={(e) => setPoster(e.target.files?.[0] || null)}
              />
              <button type="submit" className="mt-4 bg-green-500 p-2 w-full rounded text-white">
                Guardar Película
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
