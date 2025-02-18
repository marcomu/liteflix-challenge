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
  const [submittedTitle, setSubmittedTitle] = useState("") // Estado para guardar el título enviado
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
          setTitle("")
          setImage(null)
          setIsUploading(false)
        }, 2000)
      }
    }, 30)
  }

  const closeModal = () => {
    onClose()
    setShowSuccessMessage(false) 
    setIsUploading(false)
    setTitle("")
    setImage(null)
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

    // Guardo el título ingresado antes de limpiarlo
    setSubmittedTitle(title)
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

      
    } catch (err) {
      console.error("Error al agregar película:", err)
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido al agregar la película")
      setIsUploading(false)
    }
  }

  const LoadingState = () => (
    <div className="space-y-8">
      <p className="text-white font-bebas-neue text-xl">{uploadProgress}% CARGADO</p>
      <div className="w-full h-2 bg-[#d8d8d8] overflow-hidden">
        <motion.div
          className="h-full bg-[#64eebc]"
          initial={{ width: "0%" }}
          animate={{ width: `${uploadProgress}%` }}
          transition={{ ease: "linear", duration: 0.5 }}
        />
      </div>
    </div>
  )

  const SuccessMessage = () => (
    <div className="text-center text-white font-bebas-neue text-xl tracking-widest mb-4">
      <p>¡Felicitaciones!</p>
      <p> <span className="font-bold">{submittedTitle}</span> fue correctamente subida.</p>
      <button onClick={closeModal} className="bg-white text-black px-[80px] py-3 mt-14">Ir a home</button>
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
            className="bg-[#242424] p-8 rounded-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-self-end">
              <button
                onClick={closeModal}
                className="text-white hover:text-[#64eebc] transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
            <h2 className="text-[#64eebc] text-2xl font-bold font-bebas-neue text-center mb-8 tracking-widest">
              AGREGAR PELÍCULA
            </h2>

            {showSuccessMessage ? (
              <SuccessMessage />
            ) : isUploading ? (
              <>
              <LoadingState />
              <div className="mb-4 grid content-center justify-items-center justify-center items-center mt-8">
                <input
                  type="text"
                  id="title"
                  value={title}
                  placeholder="Título"
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-bebas-neue text-center placeholder:font-bebas-neue placeholder:text-center placeholder:text-white placeholder:text-lg placeholder:tracking-widest w-full bg-transparent border-b border-gray text-white p-2 focus:outline-none focus:border-[#64eebc]"
                  required
                />
                {error && <p className="text-red-500 mb-4 font-bebas-neue">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-[#d8d8d8] text-black py-3 hover:bg-opacity-90 transition-opacity mt-10 tracking-widest font-book font-bebas-neue"
                  disabled={isUploading}
                >
                  SUBIR PELÍCULA
                </button>
              </div>
            </>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Poster */}
                <div className="mb-8">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-white rounded-lg p-4 text-center grid content-center justify-items-center cursor-pointer h-[100px] ${
                      isDragActive ? "border-[#64eebc]" : ""
                    }`}
                  >
                    <input {...getInputProps()} />
                    {image ? (
                      <p className="text-white font-bebas-neue">{image.name}</p>
                    ) : isDragActive ? (
                      <p className="text-[#64eebc] font-bebas-neue">SUELTA LA IMAGEN AQUÍ ...</p>
                    ) : (
                      <div className="text-white flex items-center">
                        <ImageIcon />
                        <p className="font-bebas-neue tracking-widest mt-1 mx-4 ">
                          <span className="font-bold">Agregá un archivo</span> o arrastralo y soltalo aquí
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Título */}
                <div className="mb-4 grid content-center justify-items-center justify-center items-center">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    placeholder="Título"
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-bebas-neue text-center placeholder:font-bebas-neue placeholder:text-center placeholder:text-white placeholder:text-lg placeholder:tracking-widest w-full bg-transparent border-b border-gray text-white p-2 focus:outline-none focus:border-[#64eebc]"
                    required
                  />
                  {error && <p className="text-red-500 mb-4 font-bebas-neue">{error}</p>}

                  <button
                    type="submit"
                    className="w-full bg-[#d8d8d8] text-black py-3 hover:bg-opacity-90 transition-opacity mt-10 tracking-widest font-book font-bebas-neue"
                    disabled={isUploading}
                  >
                    SUBIR PELÍCULA
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
