import MCPService from "#server/services/MCPService.ts";
import { container } from "@sidekick-coder/zenith-kit/server";

const mcp = container.proxy<MCPService>(MCPService)

export default mcp
