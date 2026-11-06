import { defineHandler } from "@sidekick-coder/zenith-kit/server"

export default defineHandler(async () => {
    return {
        sub: true,
        message: "Hello World!"
    }
})

