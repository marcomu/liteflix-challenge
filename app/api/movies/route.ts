import { NextResponse } from "next/server"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET


console.log(`${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY} prueba de qe existe`)
console.log(`${AIRTABLE_API_KEY} prueba de qe existe`)
/*
 * Método GET: Obtiene las películas desde Airtable.
 */
export async function GET(request: Request) {
  try {
    const response = await fetch("https://api.airtable.com/v0/appY99gCjWwLEzoqg/tblzYrH4Egd77HgP7", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de Airtable:", errorText)
      return NextResponse.json(
        { error: "Error al obtener datos de Airtable", details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener películas de Airtable:", error)
    return NextResponse.json(
      { error: "No se pudieron obtener las películas de Airtable", details: error.message },
      { status: 500 },
    )
  }
}

/**
 * Método POST: Sube la imagen a Cloudinary e inserta la película en Airtable.
 */
export async function POST(request: Request) {
  try {
    // Extraer datos del formulario
    const formData = await request.formData()
    const movieName = formData.get("movie_name")
    const poster = formData.get("poster")

    if (!movieName || !(poster instanceof File)) {
      return NextResponse.json({ error: "El nombre de la película y un póster válido son requeridos" }, { status: 400 })
    }

    // Subir imagen a Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", poster, poster.name)
    cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    const cloudinaryResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: cloudinaryFormData,
    })

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text()
      console.error("Error al subir la imagen a Cloudinary:", errorText)
      return NextResponse.json(
        { error: "Error al subir la imagen a Cloudinary", details: errorText },
        { status: cloudinaryResponse.status },
      )
    }

    const cloudinaryData = await cloudinaryResponse.json()
    const uploadedImageUrl = cloudinaryData.secure_url
    if (!uploadedImageUrl) {
      throw new Error("No se pudo obtener la URL de la imagen subida a Cloudinary")
    }

    // Insertar registro en Airtable
    const airtableResponse = await fetch(`https://api.airtable.com/v0/appY99gCjWwLEzoqg/tblzYrH4Egd77HgP7`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          movie_name: movieName,
          poster_url: uploadedImageUrl,
        },
      }),
    })

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text()
      console.error("Error al insertar el registro en Airtable:", errorText)
      return NextResponse.json(
        { error: "Error al insertar el registro en Airtable", details: errorText },
        { status: airtableResponse.status },
      )
    }

    const data = await airtableResponse.json()
    console.log("Nueva película agregada:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al agregar la película a Airtable:", error)
    return NextResponse.json(
      { error: "No se pudo agregar la película a Airtable", details: error.message },
      { status: 500 },
    )
  }
}

