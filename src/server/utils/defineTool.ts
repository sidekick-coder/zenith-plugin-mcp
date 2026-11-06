import type { AclEntity } from "@sidekick-coder/zenith-kit/server";
import type { CallToolResult } from "@modelcontextprotocol/server";
import type { ValibotSchema, ValidatorResult } from "@sidekick-coder/zenith-kit/shared";

export interface ExecuteContext<T extends ValibotSchema = ValibotSchema> {
    acl: AclEntity
    input: ValidatorResult<T>
}

export interface ToolDefinition<T extends ValibotSchema = ValibotSchema> {
    name?: string;
    description?: string;
    inputSchema?: T
    metas?: Record<string, any>
    handler: (ctx: ExecuteContext<T>) => (CallToolResult | Promise<CallToolResult>);
}

export function defineTool<T extends ValibotSchema = ValibotSchema>(definition: ToolDefinition<T>): ToolDefinition<T> {
    definition.metas = definition.metas || {}
    return definition;
}
