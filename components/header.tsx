"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bell, Menu, User, Plus } from "lucide-react"
import AddMovieModal from "./AddMovieModal"

interface HeaderProps {
  onMovieAdded: () => void
}

export default function Header({ onMovieAdded }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-40 px-8 py-4 h-20 flex items-center justify-between bg-black bg-opacity-0"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="text-primary text-2xl font-bold font-bebas-neue">
            LITEFLIX
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors font-bebas-neue"
            onClick={handleOpenModal}
          >
            <Plus size={16} />
            AGREGAR PELÍCULA
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button type="button" className="nav-link" aria-label="Notificaciones">
            <Bell className="w-5 h-5" />
          </button>
          <button type="button" className="nav-link" aria-label="Perfil">
            <User className="w-5 h-5" />
          </button>
          <button type="button" className="nav-link md:hidden" aria-label="Menú">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <AddMovieModal isOpen={isModalOpen} onClose={handleCloseModal} onMovieAdded={onMovieAdded} />
    </>
  )
}

