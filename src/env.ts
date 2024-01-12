import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
    config({ path: ".env.local" });
}

export const monitorEnv = createEnv({
    server: {
        CLOUDFLARE_EMAIL: z.string(),
        CLOUDFLARE_ZONE_ID: z.string(),
        CLOUDFLARE_API_KEY: z.string(),
        CLOUDFLARE_DNS_RECORD_ID: z.string(),
    },
    runtimeEnv: process.env,
});
