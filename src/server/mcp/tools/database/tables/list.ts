import { defineTool } from "#server/utils/defineTool.ts";
import { database } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";

export default defineTool({
    description: "list database tables",
    inputSchema: validator.create(v => v.object({
        search: v.optional(v.string()),
    })),
    handler: async (ctx) => {
        ctx.acl.authorize("list", "Table")

        let result = await database.introspection.getTables()

        if (ctx.input.search) {
            result = result.filter(table => table.name.includes(ctx.input.search!))
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result)
                }
            ]
        }

    }

})
