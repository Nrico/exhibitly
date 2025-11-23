import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: { // Colors should be inside extend
      colors: {
        // Base colors (optional, if you want to override default grays etc.)
        // 'white': '#ffffff', // These would conflict with default Tailwind colors
        // 'black': '#000000',
        // 'gray-50': '#fafafa',
        // 'gray-100': '#f4f4f4',
        // 'gray-200': '#e5e5e5',
        // 'gray-400': '#999',
        // 'gray-700': '#333',
        // 'gray-800': '#1a1a1a',

        // Project-specific colors
        'bg-color': '#ffffff',
        'bg-alt': '#fafafa',
        'text-main': '#1a1a1a',
        'text-muted': '#666666',
        'border-color': '#e5e5e5',
        'auth-accent': '#111',
        'auth-error': '#d32f2f',
        'auth-accent-dark': '#333',
        'bg-visual-panel': '#f0f0f0',
        'bg-body-dashboard': '#f8f9fa',
        'bg-card-dashboard': '#ffffff',
        'text-main-dashboard': '#111111',
        'text-muted-dashboard': '#666666',
        'border-dashboard': '#e5e5e5',
        'sidebar-bg-dashboard': '#111111',
        'sidebar-text-dashboard': '#888888',
        'accent-green-dashboard': '#2e7d32',
        'accent-red-dashboard': '#c62828',
        'accent-yellow-dashboard': '#f57f17',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        'xl': '12px',
        'md': '6px',
      },
    },
  },
  plugins: [],
}
export default config