import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import ToolService from "./ToolService.ts";
import { toStandardJsonSchema } from "@valibot/to-json-schema";
import { auth, logger, permissionRepository, AclEntity, http } from "@sidekick-coder/zenith-kit/server";
import { BaseException, LoggerService, PermissionEntity, tryCatch } from "@sidekick-coder/zenith-kit/shared";
import type { ToolDefinition } from "#server/utils/defineTool.ts";
import { toNodeHandler } from "@modelcontextprotocol/node";

export default class MCPService {
    public static __container_entry_key = 'MCPService'
    public tools: ToolService
    public server: McpServer
    public logger: LoggerService

    constructor() {
        this.tools = new ToolService()
        this.server = new McpServer({ name: "zenith", version: "0.0.1" })
        this.logger = logger.child({ label: 'mcp' })
    }

    public createToolHandler(tool: ToolDefinition) {
        return async (input: any, ctx: any) => {
            const tokenValue = ctx.http?.req?.headers.get('authorization')?.replace('Bearer ', '')

            const user = await auth.authenticate(tokenValue, {
                tokenTypes: ['api', 'mpc']
            })

            if (!user) {
                throw new BaseException("Unauthorized", 401)
            }

            const permissions = await permissionRepository.findMany({
                assignment: { type: "user", id: String(user.id) }
            })

            const acl = new AclEntity({
                permissions: permissions.map(p => PermissionEntity.from(p as any)),
            })

            return await tool.handler({
                acl: acl,
                input: input as any
            })
        }
    }

    public async loadTools() {
        for (const tool of this.tools.list()) {
            if (!tool.name) {
                this.logger.warn(`tool ${tool.description} has no name, skip`)
                continue
            }

            const options = {
                description: tool.description,
                inputSchema: tool.inputSchema ? toStandardJsonSchema(tool.inputSchema) : undefined
            }

            const handler = this.createToolHandler(tool)

            this.server.registerTool(tool.name, options, handler)

            this.logger.info(`register tool ${tool.name} successfully`)
        }
    }

    public async load() {
        await this.loadTools()

        const handler = createMcpHandler(() => this.server)
        const node = toNodeHandler(handler)
        const app = http.getExpressApp()

        app.all('/mcp', (req, res) => void node(req, res, req.body))

        this.logger.info('registered at /mcp')
    }
}
