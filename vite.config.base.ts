import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    define: {
        'process.env': {
            NODE_ENV: 'production',
        }
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => {
                        return ['iconify-icon'].includes(tag)
                    }
                }
            }
        }),
        tailwindcss(),
    ],
    build: {
        minify: true,
        manifest: true,
        rollupOptions: {
            external: [
                'vue/server-renderer',
                '@vue/server-renderer',

                'vue',
                /^vue\//,

                'vue-router',
                /^vue-router\//,

                'vee-validate',
                /^vee-validate\//,
            ],
        },
    },
})
