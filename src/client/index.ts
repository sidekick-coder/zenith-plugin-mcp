import { authGuard, router, lifecycle, menu } from '@sidekick-coder/zenith-kit/client'
import type { DefineComponent } from 'vue'
import { definePlugin } from '@sidekick-coder/zenith-kit/shared'

export default definePlugin(async () => {
    const id = 'starter'

    lifecycle.on('load', async () => {
        router.auto(import.meta.glob<DefineComponent>('./pages/admin/**/*.vue'), {
            strip: ['pages', 'admin'],
            prefix: `/admin/${id}`,
            guards: [authGuard]
        })

        router.auto(import.meta.glob<DefineComponent>('./pages/public/**/*.vue'), {
            strip: ['pages', 'public'],
            prefix: id,
        })

        menu.add({
            label: 'Starter',
            icon: 'lucide:box',
            group: $t('Plugins'),
            layout: 'admin',
            to: `/admin/${id}`,
        })
    })
})

