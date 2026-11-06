import { defineTool } from "#server/utils/defineTool.ts";
import { userRepository } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";

export default defineTool({
    description: "delete a user by id",
    inputSchema: validator.create(v => v.object({
        id: v.number(),
    })),
    handler: async (ctx) => {
        const id = ctx.input.id

        const user = await userRepository.findByIdOrFail(id)

        ctx.acl.authorize("delete", "User", user)

        const deletedAt = new Date().toISOString()

        await userRepository.updateById(id, { deleted_at: deletedAt })

        user.deleted_at = deletedAt

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
