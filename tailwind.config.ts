
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				primary: {
					DEFAULT: '#4d4dff',
					foreground: '#ffffff'
				},
				background: '#ffffff',
				foreground: '#1e293b',
				border: '#e2e8f0',
				input: '#e2e8f0',
				ring: '#4d4dff',
				secondary: {
					DEFAULT: '#f8fafc',
					foreground: '#334155'
				},
				muted: {
					DEFAULT: '#f8fafc',
					foreground: '#64748b'
				},
				accent: {
					DEFAULT: '#f1f5f9',
					foreground: '#1e293b'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#1e293b'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#1e293b'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: 'calc(0.5rem - 2px)',
				sm: 'calc(0.5rem - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
