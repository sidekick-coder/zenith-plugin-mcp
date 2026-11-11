import type { ToolDefinition } from "#server/utils/defineTool.ts";
import { importGlob, logger } from "@sidekick-coder/zenith-kit/server";
import type { LoggerService } from "@sidekick-coder/zenith-kit/shared";
import set from "lodash-es/set.js";
import path from "path";

interface AddDirectoryOptions {
    prefix?: string;
}

export default class ToolService {
    public tools: Map<string, ToolDefinition> = new Map()
    public logger: LoggerService
    public debug: boolean = false

    constructor() {
        this.logger = logger
    }

    public setLogger(logger: LoggerService) {
        this.logger = logger
        return this
    }

    public setDebug(debug: boolean) {
        this.debug = debug
        return this
    }

    public add(tool: ToolDefinition) {
        this.tools.set(tool.name!, tool)

        if (this.debug) {
            this.logger.debug(`tool added "${tool.name}"`, {
                name: tool.name,
                description: tool.description,
            })
        }
    }

    public async addDirectory(directory: string, options: AddDirectoryOptions = {}) {
        const prefix = options.prefix || ''
        const pattern = path.join(directory, '**/*.(ts|js|mjs|mts)')
        const files = await importGlob(pattern)

        for (const [filename, file] of Object.entries(files)) {
            const mod = file.default || file

            const relative = path.relative(directory, filename)

            let name = relative
                .replace(/\.(ts|js|mjs|mts)$/, '')
                .replaceAll(path.sep, '.')


            if (prefix) {
                name = `${prefix}.${name}`
            }

            mod.name = mod.name || name

            set(mod, 'metas.filename', filename)

            this.add(mod)
        }
    }

    public list(): ToolDefinition[] {
        return Array.from(this.tools.values())
    }
}
