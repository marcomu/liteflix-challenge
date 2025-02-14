import type { Config } from "tailwindcss"

const config: Config = {
  // Configuración del modo oscuro basado en clases
  darkMode: "class", // También podrías usar ["class"] si lo prefieres

  // Especifica los archivos donde se utilizarán las clases de Tailwind
  content: [
    "app/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // Incluye archivos en la raíz si es necesario:
    "*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        "bebas-neue": ["Bebas Neue", "sans-serif"],
      },
      colors: {
        // Colores definidos a partir de variables CSS para mayor flexibilidad
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores originales para referencia o uso específico
        "primary-original": "#4FE2C8",
        "secondary-original": "#242424"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Extensión para aplicar sombras de texto usando el plugin correspondiente
      textShadow: {
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-textshadow")],
}

export default config

