import { defineHandler } from "@sidekick-coder/zenith-kit/server"

export default defineHandler(async (ctx) => {
    return {
        message: "Hello " + ctx.params.name + "!"
    }
})
