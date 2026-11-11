import { defineTool } from "#server/utils/defineTool.ts";
import { database } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";
import { sql } from "kysely";

export default defineTool({
    description: "query database",
    inputSchema: validator.create(v => v.object({
        query: v.string(),
    })),
    handler: async (ctx) => {
        ctx.acl.authorize("manage", "Database")

        const result = await sql.raw(ctx.input.query).execute(database)

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
