import type { ToolDefinition } from "#server/utils/defineTool.ts";
import { importAll, importGlob } from "@sidekick-coder/zenith-kit/server";
import set from "lodash-es/set.js";
import path from "path";

interface AddDirectoryOptions {
    prefix?: string;
}

export default class ToolService {
    public tools: Map<string, ToolDefinition> = new Map()

    public add(tool: ToolDefinition) {
        this.tools.set(tool.name!, tool)
    }

    public async addDirectory(directory: string, options: AddDirectoryOptions = {}) {
        const prefix = options.prefix || ''
        const pattern = path.join(directory, '**/*.(ts|js|mjs|mts)')
        const files = await importGlob(pattern, {  })

        for (const [filename, file] of Object.entries(files)) {
            const mod = file.default || file
            const relative = path.relative(directory, filename)
            let name = relative
                .replace(/\.(ts|js|mjs|mts)$/, '')
                .replace(path.sep, '.')

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
