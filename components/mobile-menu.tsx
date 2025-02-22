"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, User, Plus } from "lucide-react"
import Link from "next/link"
import AddMovieModal from "./AddMovieModal"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onMovieAdded?: () => void
}

export default function MobileMenu({ isOpen, onClose, onMovieAdded }: MobileMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const menuItems = [
    { label: "INICIO", href: "#" },
    { label: "SERIES", href: "#" },
    { label: "PELÍCULAS", href: "#" },
    { label: "AGREGADAS RECIENTEMENTE", href: "#" },
    { label: "POPULARES", href: "#" },
    { label: "MIS PELÍCULAS", href: "#" },
    { label: "MI LISTA", href: "#" },
  ]

  const handleAddMovie = () => {
    setIsModalOpen(true)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-[#242424] z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-6 py-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-12">
                <button onClick={onClose} className="text-white p-2">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-6">
                  <button type="button" className="nav-link" aria-label="Notificaciones">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button type="button" className="nav-link" aria-label="Perfil">
                    <User className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-white text-2xl font-bebas-neue tracking-[0.12em] hover:text-primary transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Add Movie Button */}
                <button
                  onClick={handleAddMovie}
                  className="flex items-center gap-2 text-2xl font-bebas-neue tracking-[0.12em] text-white hover:text-primary transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  AGREGAR PELÍCULA
                </button>
              </nav>

              {/* Logout */}
              <button
                onClick={onClose}
                className="absolute bottom-8 left-6 text-white text-xl font-bebas-neue tracking-[0.12em] hover:text-primary transition-colors"
              >
                CERRAR SESIÓN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddMovieModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onMovieAdded={onMovieAdded} />
    </>
  )
}

