import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: [
        'src/server/expose.ts',
    ],
    outDir: 'dist/server-expose',
    tsconfig: 'tsconfig.server.json',
    dts: true,
    minify: true,
    unbundle: true,
})

