import { defineTool } from "#server/utils/defineTool.ts";
import { userRepository } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";

export default defineTool({
    description: "List all users",
    inputSchema: validator.create(v => v.object({
        limit: v.optional(v.number()),
        offset: v.optional(v.number()),
    })),
    handler: async (ctx) => {
        ctx.acl.authorize("list", "User")

        const users = await userRepository.findMany(ctx.input)

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(users)
                }
            ]
        }

    }

})
