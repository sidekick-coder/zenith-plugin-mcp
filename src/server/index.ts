import { emmitter, container, lifecycle, config, logger } from '@sidekick-coder/zenith-kit/server'
import { definePlugin } from '@sidekick-coder/zenith-kit/shared'
import MCPService from './services/MCPService.ts';
import path from 'path'

const mcp = new MCPService()

async function load() {
    mcp
        .setDebug(config.getOne(['mcp.debug', 'app.debug'], false))
        .setLogger(logger.child({ label: 'mcp' }))

    container.set(MCPService, mcp)

    await emmitter.emitAndWait('mcp:registered', { mcp })

    await mcp.load()
}

async function tools() {
    await mcp.tools.addDirectory(path.resolve(import.meta.dirname, 'mcp', 'tools'))
}

export default definePlugin(async () => {
    emmitter.on('mcp:registered', tools)

    emmitter.on('http:registered', load)
})

