"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ImageIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import type React from "react"

interface AddMovieModalProps {
  isOpen: boolean
  onClose: () => void
  onMovieAdded?: () => void
}

export default function AddMovieModal({ isOpen, onClose, onMovieAdded }: AddMovieModalProps) {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  })

  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setShowSuccessMessage(true)
        setTimeout(() => {
          onMovieAdded && onMovieAdded()
          onClose()
        }, 2000)
      }
    }, 30)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Por favor, ingresa un título para la película.")
      return
    }

    if (!image) {
      setError("Por favor, sube una imagen válida para la película.")
      return
    }

    setIsUploading(true)
    simulateProgress()

    const formData = new FormData()
    formData.append("movie_name", title)
    formData.append("poster", image, image.name)

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al agregar la película")
      }

      setTitle("")
      setImage(null)
    } catch (err) {
      console.error("Error al agregar película:", err)
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido al agregar la película")
      setIsUploading(false)
    }
  }

  const LoadingState = () => (
    <div className="space-y-8">
      <p className="text-white font-bebas-neue text-xl">CARGANDO {uploadProgress}%</p>
      <div className="w-full h-1 bg-[#d8d8d8] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#64eebc]"
          initial={{ width: "0%" }}
          animate={{ width: `${uploadProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="text-center space-y-8">
        <p className="text-white font-bebas-neue text-2xl mt-16">LITEFLIX THE MOVIE</p>
        <button onClick={onClose} className="text-white font-bebas-neue hover:text-[#64eebc] transition-colors">
          CANCELAR
        </button>
      </div>
    </div>
  )

  const SuccessMessage = () => (
    <div className="text-center space-y-4">
      <p className="text-[#64eebc] font-bebas-neue text-2xl">¡PELÍCULA AGREGADA CON ÉXITO!</p>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#242424] p-8 rounded-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[#64eebc] text-2xl font-bold font-bebas-neue">AGREGAR PELÍCULA</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-[#64eebc] transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            {showSuccessMessage ? (
              <SuccessMessage />
            ) : isUploading ? (
              <LoadingState />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="title" className="block text-white text-sm mb-2 font-bebas-neue">
                    TÍTULO
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white p-2 focus:outline-none focus:border-[#64eebc]"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-white text-sm mb-2 font-bebas-neue">POSTER</label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-white rounded-lg p-4 text-center cursor-pointer ${
                      isDragActive ? "border-[#64eebc]" : ""
                    }`}
                  >
                    <input {...getInputProps()} />
                    {image ? (
                      <p className="text-white font-bebas-neue">{image.name}</p>
                    ) : isDragActive ? (
                      <p className="text-[#64eebc] font-bebas-neue">SUELTA LA IMAGEN AQUÍ ...</p>
                    ) : (
                      <div className="text-white">
                        <ImageIcon className="mx-auto mb-2" />
                        <p className="font-bebas-neue">
                          ARRASTRA Y SUELTA UNA IMAGEN AQUÍ, O HAZ CLICK PARA SELECCIONAR
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 mb-4 font-bebas-neue">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-[#d8d8d8] text-black py-3 rounded hover:bg-opacity-90 transition-opacity flex items-center justify-center font-bebas-neue"
                  disabled={isUploading}
                >
                  SUBIR PELÍCULA
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

