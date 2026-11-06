import { emmitter, container } from '@sidekick-coder/zenith-kit/server'
import { definePlugin } from '@sidekick-coder/zenith-kit/shared'
import MCPService from './services/MCPService.ts';
import path from 'path'

export default definePlugin(async () => {
    const mcp = new MCPService()

    container.set(MCPService, mcp)

    await mcp.tools.addDirectory(path.resolve(import.meta.dirname, 'mcp', 'tools'))

    await emmitter.emitAndWait('mcp:registered', { mcp })

    emmitter.on('http:registered', () => mcp.load())
})

