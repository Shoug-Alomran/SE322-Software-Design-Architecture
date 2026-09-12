// Shared Tailwind (Play CDN) configuration for every page.
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            colors: {
                navy: {
                    900: '#030712',
                    800: '#060b13',
                    700: '#1e293b',
                },
                blueprint: {
                    bg: '#030712',
                    panel: '#060b13',
                    accent: '#00f0ff',
                    dark: '#06b6d4',
                    text: '#e2e8f0',
                    textMuted: '#94a3b8',
                },
            },
            animation: {
                'dash': 'dash 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                dash: {
                    to: { strokeDashoffset: '-1000' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
            },
        },
    },
};
