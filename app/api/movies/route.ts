import { NextResponse } from "next/server"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME

/*
 * Método GET: Obtiene las películas desde Airtable ordenadas por fecha de creación (orden de inserción).
 */
export async function GET(request: Request) {
  try {
    const response = await fetch(
      "https://api.airtable.com/v0/appY99gCjWwLEzoqg/tblzYrH4Egd77HgP7?sort[0][field]=createdTime&sort[0][direction]=desc",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

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
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      { error: "No se pudieron obtener las películas de Airtable", details: errorMessage },
      { status: 500 },
    )
  }
}

/**
 * Método POST: Sube la imagen a Cloudinary e inserta la película en Airtable.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let movieName, poster, poster_url

    if (contentType.includes("application/json")) {
      // Procesamos el JSON directamente
      const data = await request.json()
      movieName = data.movie_name
      poster_url = data.poster_url
      if (!movieName || !poster_url) {
        return NextResponse.json(
          { error: "El nombre de la película y el poster_url son requeridos" },
          { status: 400 },
        )
      }

      // Insertar registro en Airtable usando poster_url
      const airtableResponse = await fetch(
        `https://api.airtable.com/v0/appY99gCjWwLEzoqg/tblzYrH4Egd77HgP7`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              movie_name: movieName,
              poster_url: poster_url,
            },
          }),
        },
      )

      if (!airtableResponse.ok) {
        const errorText = await airtableResponse.text()
        console.error("Error al insertar el registro en Airtable:", errorText)
        return NextResponse.json(
          { error: "Error al insertar el registro en Airtable", details: errorText },
          { status: airtableResponse.status },
        )
      }

      const airtableData = await airtableResponse.json()
      console.log("Nueva película agregada:", airtableData)
      return NextResponse.json(airtableData)
    } else {
      // Procesamos formData (flujo de Cloudinary)
      const formData = await request.formData()
      movieName = formData.get("movie_name")
      poster = formData.get("poster")

      if (!movieName || !(poster instanceof File)) {
        return NextResponse.json(
          { error: "El nombre de la película y un póster válido son requeridos" },
          { status: 400 },
        )
      }

      // Subir imagen a Cloudinary
      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", poster, poster.name)
      cloudinaryFormData.append("upload_preset", "default")

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      )

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

      // Insertar registro en Airtable con el URL de Cloudinary
      const airtableResponse = await fetch(
        "https://api.airtable.com/v0/appY99gCjWwLEzoqg/tblzYrH4Egd77HgP7",
        {
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
        },
      )

      if (!airtableResponse.ok) {
        const errorText = await airtableResponse.text()
        console.error("Error al insertar el registro en Airtable:", errorText)
        return NextResponse.json(
          { error: "Error al insertar el registro en Airtable", details: errorText },
          { status: airtableResponse.status },
        )
      }

      const airtableData = await airtableResponse.json()
      console.log("Nueva película agregada:", airtableData)
      return NextResponse.json(airtableData)
    }
  } catch (error) {
    console.error("Error al agregar la película a Airtable:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json(
      { error: "No se pudo agregar la película a Airtable", details: errorMessage },
      { status: 500 },
    )
  }
}
