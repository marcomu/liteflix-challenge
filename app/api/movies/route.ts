import { NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      }
    );

    if (!response.ok) throw new Error("Error al obtener películas");

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
