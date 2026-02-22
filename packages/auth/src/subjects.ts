import { z } from "zod"
import { createSubjects } from "@openauthjs/openauth/subject"

export const subjects = createSubjects({
    account: z.object({
        accountID: z.string(),
        email: z.string(),
    }),
    user: z.object({
        userID: z.string(),
        workspaceID: z.string(),
    }),
})
