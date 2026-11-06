import { defineTool } from "#server/utils/defineTool.ts";
import { auth } from "@sidekick-coder/zenith-kit/server";
import { validator } from "@sidekick-coder/zenith-kit/shared";

export default defineTool({
    description: "create a new user",
    inputSchema: validator.create(v => v.object({
        name: v.string(),
        email: v.pipe(v.string(), v.email()),
        password: v.pipe(v.string(), v.minLength(6)),
        username: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9_]+$/)),
    })),
    handler: async (ctx) => {
        ctx.acl.authorize("create", "User")

        const user = await auth.register(ctx.input)

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
