import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4A853",
        secondary: "#B8860B",
        accent: "#F5DEB3",
        dark: {
          900: "#0D0D0D",
          800: "#1A1A1A",
          700: "#2D2D2D",
          600: "#3D3D3D",
          500: "#4D4D4D",
        },
        gold: {
          50: "#FFF9E6",
          100: "#FFF3CC",
          200: "#FFE799",
          300: "#FFDB66",
          400: "#FFCF33",
          500: "#D4A853",
          600: "#B8860B",
          700: "#996F0A",
          800: "#7A5908",
          900: "#5C4306",
        },
        cream: "#FAF7F2",
        warm: {
          50: "#FDF8F3",
          100: "#F5EDE4",
          200: "#E8DDD0",
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dark-pattern': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
