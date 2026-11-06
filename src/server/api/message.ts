import { defineHandler } from "@sidekick-coder/zenith-kit/server"

export default defineHandler(async () => {
    return {
        message: "Hello World!"
    }
})
