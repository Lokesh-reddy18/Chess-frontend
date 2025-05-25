/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
            dark: "#2a4db5",
            light: "#6a8bff",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
            dark: "#4a8054",
            light: "#7ac284",
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
            dark: "#d97706",
            light: "#fbbf24",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          background: {
            DEFAULT: "#121212",
            light: "#1e1e1e",
            dark: "#0a0a0a",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: [
            '"Fira Code"',
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ],
          chess: ['"Fira Code"', "monospace"],
        },
        animation: {
          float: "float 6s ease-in-out infinite",
          "float-delayed": "float 6s ease-in-out 3s infinite",
          pulse: "pulse 2s infinite",
          shine: "shine 3s infinite",
          gradient: "gradient 8s ease infinite",
          "gradient-x": "gradient-x 8s ease infinite",
        },
        boxShadow: {
          glow: "0 0 15px rgba(65, 105, 225, 0.7)",
          "glow-green": "0 0 15px rgba(95, 161, 105, 0.7)",
          "glow-amber": "0 0 15px rgba(245, 158, 11, 0.7)",
        },
        backgroundImage: {
          "chess-gradient": "linear-gradient(to right, #4169e1, #5fa169)",
        },
        transitionProperty: {
          height: "height",
          spacing: "margin, padding",
        },
        brightness: {
          40: ".4",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  
  