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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New colors based on the dark UI
				glass: {
					DEFAULT: 'rgba(24, 24, 27, 0.6)',
					light: 'rgba(30, 30, 35, 0.6)',
					dark: 'rgba(18, 18, 21, 0.6)',
					border: 'rgba(55, 55, 60, 0.3)',
					highlight: 'rgba(255, 255, 255, 0.05)',
				},
				status: {
					success: '#4ade80',
					warning: '#f97316',
					error: '#ef4444',
					progress: '#f97316',
				},
				// Keep existing Bento and lovable colors
				bento: {
					gray: {
						50: '#f9f9f9',
						100: '#f3f3f3',
						200: '#e5e5e5',
						300: '#d4d4d4',
						400: '#a3a3a3',
						500: '#737373',
						600: '#525252',
						700: '#404040',
						800: '#262626',
						900: '#171717',
					},
					yellow: {
						50: '#FEF7CD',
						100: '#FEEF9B',
						500: '#EAB308',
						600: '#CA8A04',
					},
					orange: {
						50: '#FFF7ED', 
						100: '#FFEDD5',
						300: '#FDBA74',
						400: '#FB923C',
						500: '#F97316',
						600: '#EA580C',
					},
					brown: {
						100: '#f5f5f4',
						500: '#78716c',
						600: '#57534e',
						700: '#44403c',
						800: '#292524',
					}
				},
				lovable: {
					purple: '#8B5CF6',
					pink: '#D946EF',
					orange: '#F97316',
					blue: '#0EA5E9',
					yellow: '#EAB308',
				},
				
				// New orange-brown theme colors
				lawbit: {
					orange: {
						50: '#FFF7ED',
						100: '#FFEDD5',
						200: '#FED7AA',
						300: '#FDBA74',
						400: '#FB923C',
						500: '#F97316',
						600: '#EA580C',
						700: '#C2410C',
						800: '#9A3412',
						900: '#7C2D12',
					},
					brown: {
						50: '#FDFAEF',
						100: '#FDF3D7', 
						200: '#FCE9BB',
						300: '#F7D6A0',
						400: '#E9BC74',
						500: '#D49B57',
						600: '#B5773D',
						700: '#8D582E',
						800: '#693D1F',
						900: '#452512',
					}
				}
			},
			fontFamily: {
				sans: ['Inter var', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' },
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'float': {
					'0%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
					'100%': { transform: 'translateY(0px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				
				'glow': {
					'0%, 100%': { boxShadow: '0 0 15px rgba(249, 115, 22, 0.6)' },
					'50%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.8)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				
				'glow': 'glow 3s ease-in-out infinite',
			},
			backdropBlur: {
				xs: '2px',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(119deg, rgba(255, 255, 255, 0.3) -20%, rgba(255, 255, 255, 0.05) 90%)',
				'glass-gradient-dark': 'linear-gradient(119deg, rgba(79, 70, 229, 0.3) -20%, rgba(79, 70, 229, 0.05) 90%)',
				'primary-gradient': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #818CF8 100%)',
				'primary-gradient-hover': 'linear-gradient(135deg, #4F46E5 0%, #3730A3 50%, #6366F1 100%)',
				'dark-gradient': 'linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4F46E5 100%)',
				'dark-gradient-hover': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #3730A3 100%)',
				'lovable-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #F97316 100%)',
				'lovable-gradient-hover': 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #EA580C 100%)',
				'dark-gradient': 'linear-gradient(to bottom right, rgba(30, 30, 35, 0.5), rgba(18, 18, 21, 0.5))',
				'glass-gradient': 'linear-gradient(to bottom right, rgba(50, 50, 55, 0.2), rgba(24, 24, 27, 0.2))',
				
				// Add new orange-brown gradients
				'orange-brown-gradient': 'linear-gradient(135deg, #F97316 0%, #B5773D 100%)',
				'orange-brown-gradient-hover': 'linear-gradient(135deg, #EA580C 0%, #8D582E 100%)',
				'brown-orange-gradient': 'linear-gradient(135deg, #B5773D 0%, #F97316 100%)',
				'brown-orange-gradient-hover': 'linear-gradient(135deg, #8D582E 0%, #EA580C 100%)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
