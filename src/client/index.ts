import { authGuard, router, lifecycle } from '@sidekick-coder/zenith-kit/client'
import type { DefineComponent } from 'vue'
import { definePlugin } from '@sidekick-coder/zenith-kit/shared'

export default definePlugin(async () => {
    const id = 'starter'

    lifecycle.on('load', async () => {
        router.auto(import.meta.glob<DefineComponent>('./pages/**/*.vue'), {
            strip: ['pages'],
            prefix: `/admin/${id}`,
            guards: [authGuard]
        })
    })
})

