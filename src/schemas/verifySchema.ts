import { z } from "zod";

export const verifySchema = z.object({
    code: z
        .string({ required_error: "Verification code is required" })
        .length(6, "verification code must be 6 digit"),
});
