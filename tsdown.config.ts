import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: [
        'src/server/index.ts',
        'src/server/api/**/*.ts',
        'src/server/migrations/**/*.ts',
        'src/server/seeders/**/*.ts',
    ],
    outDir: 'dist/server',
    tsconfig: 'tsconfig.server.json',
    minify: true,
    unbundle: true,
})

