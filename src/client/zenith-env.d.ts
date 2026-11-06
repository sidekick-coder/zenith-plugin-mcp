import type { ContainerService, tryCatch } from '#shared/index.ts'
import type ConfigService from '#shared/services/ConfigService.ts'
import type TranslatorService from '#shared/services/TranslatorService.ts'

export { }

declare global {
    var imports: Map<string, () => Promise<any>>
    var importAsync: (id: string) => Promise<any>

    var __CONFIG__: any | undefined
    var __CONTAINER__: Record<string, any> | undefined
    var __STATE__: Record<string, any> | undefined

    var config: ConfigService | undefined // only on dev
    var clientContainer: ContainerService | undefined
    var $t: TranslatorService['t']
    var $dt: TranslatorService['datetime']
    var $d: TranslatorService['date']
    var $translator: TranslatorService
    var $try: typeof tryCatch
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $t(key: string, ...args: any[]): string;
        $dt(value: any, options?: Intl.DateTimeFormatOptions): string;
        $d(value: any, options?: Intl.DateTimeFormatOptions): string;
        $translator: TranslatorService;
        $try: typeof tryCatch;
    }
}



