"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bell, MenuIcon, User, Plus } from "lucide-react"
import AddMovieModal from "./AddMovieModal"
import Menu from "./menu"

interface HeaderProps {
  onMovieAdded: () => void
}

export default function Header({ onMovieAdded }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        className="fixed w-full z-40 px-4 md:px-20 py-16 h-20 flex items-center justify-between bg-black bg-opacity-0"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="text-primary text-4xl tracking-[.15em] font-bebas-neue">
            <span className="font-bold">LITE</span>
            <span className="font-medium">FLIX</span>
          </Link>
          <button
            type="button"
            className="hidden md:flex gap-1 text-lg tracking-[.25em] hover:text-primary transition-colors font-bebas-neue items-center"
            onClick={handleOpenModal}
          >
            <Plus className="ml-2" size={22} />
            <span>AGREGAR PELÍCULA</span>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button type="button" className="nav-link hidden md:block" aria-label="Notificaciones">
            <Bell className="w-5 h-5" />
          </button>
          <button type="button" className="nav-link hidden md:block" aria-label="Perfil">
            <User className="w-5 h-5" />
          </button>
          <button type="button" className="nav-link" aria-label="Menú" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <AddMovieModal isOpen={isModalOpen} onClose={handleCloseModal} onMovieAdded={onMovieAdded} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onMovieAdded={onMovieAdded} />
    </>
  )
}

