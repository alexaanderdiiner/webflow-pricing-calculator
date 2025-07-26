/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Spring Design System Colors
        brand: {
          DEFAULT: '#146EF5',
          dark: '#0A0F1C',
          light: '#D6E9FF',
        },
        accent: '#FF9C66',
        surface: '#1C1C1E',
        gray: {
          900: '#171717',
          800: '#222222',
          700: '#363636',
          600: '#5A5A5A',
          500: '#757575',
          400: '#898989',
          300: '#ABABAB',
          200: '#D8D8D8',
          100: '#F0F0F0',
        },
        black: '#080808',
        white: '#FFFFFF',
        // Keep shadcn/ui colors for compatibility
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['"WF Visual Sans Text"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"WF Visual Sans Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h0: ['8rem', { lineHeight: '1.04', letterSpacing: '0.01em' }],
        h1: ['5.313rem', { lineHeight: '1.04', letterSpacing: '0.01em' }],
        h2: ['3.5rem', { lineHeight: '1.04', letterSpacing: '0.01em' }],
        h3: ['2.313rem', { lineHeight: '1.04', letterSpacing: '0.01em' }],
        h4: ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
        h5: ['1rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
        h6: ['0.9375rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        caption: ['0.625rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        paragraph: [
          '1rem',
          {
            lineHeight: '1.6',
          },
        ],
        paragraphSm: ['0.9375rem', { lineHeight: '1.65' }],
        paragraphLg: ['1.125rem', { lineHeight: '1.6' }],
        paragraphXl: ['1.5rem', { lineHeight: '1.6' }],
        paragraphXxl: ['2.125rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
