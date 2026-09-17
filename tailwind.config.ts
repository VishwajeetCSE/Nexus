import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nexus: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b84',
          900: '#0c3f6e',
          950: '#082849',
        },
        badge: {
          admin: '#2563eb', // Official College Administration - Blue
          club: '#10b981',  // Registered Student Club - Green
          student: '#64748b', // General Student - Gray
          sos: '#f43f5e',   // Urgent Peer SOS Query - Rose/Coral
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(14, 140, 233, 0.25)',
        'glow': '0 0 25px -5px rgba(14, 140, 233, 0.35)',
        'glow-sos': '0 0 20px -3px rgba(244, 63, 94, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
