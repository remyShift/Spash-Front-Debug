import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: '#353540',
				lightBackground: '#444454',
				lighterBackground: '#72728B',
				primary: '#FF5F49',
				secondary: '#E41145',
			},
			fontFamily: {
				gilroy: [
					'var(--font-gilroy)'
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { 
						opacity: '0',
						transform: 'translateY(-10px)' 
					},
				},
				slideIn: {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(-20px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0)' 
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadeOut: 'fadeOut 3s ease-in-out',
				slideIn: 'slideIn 0.3s ease-out forwards, fadeOut 0.3s ease-in 2.7s forwards',
			},
			backgroundImage: {
				'point-gradient': 'linear-gradient(to bottom, #FF324B 50%, #181826)',
				'inter-point-gradient': 'linear-gradient(to bottom, #3448FA 50%, #181826)'
			}
		}
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('tailwindcss-animate')
	],
} satisfies Config;
