import tailwind from 'bun-plugin-tailwind'

const result = await Bun.build({
  entrypoints: ['./index.html'],
  outdir: './dist',
  plugins: [tailwind],
  minify: true,
  target: 'browser',
  define: {
    'import.meta.env.PROD': 'true',
    'import.meta.env.DEV': 'false',
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL ?? ''),
  },
})

if (!result.success) {
  console.error(result.logs)
  process.exit(1)
}

console.log('Build completado en ./dist')