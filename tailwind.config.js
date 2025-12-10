/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-color)',
                secondary: 'var(--secondary-color)',
                accent: 'var(--accent-color)',
                text: 'var(--text-color)',
                'light-text': 'var(--light-text)',
                link: 'var(--link-color)',
                'link-hover': 'var(--link-hover)',
                success: 'var(--success-color)',
                warning: 'var(--warning-color)',
                error: 'var(--error-color)',
                tertiary: 'var(--tertiary-color)',
            },
        },
    },
    plugins: [],
}
