import { defineTool } from "#server/utils/defineTool.ts";
import { userRepository } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";

export default defineTool({
    description: "show user by id",
    inputSchema: validator.create(v => v.object({
        id: v.number(),
    })),
    handler: async (ctx) => {
        const user = await userRepository.findByIdOrFail(ctx.input.id)

        ctx.acl.authorize("read", "User", user)

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(user)
                }
            ]
        }

    }

})
