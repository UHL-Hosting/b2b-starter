import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const KNOWN_DEFAULT_SECRETS = ["supersecret"];

function requireSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} must be set. Generate one with \`openssl rand -base64 32\`.`
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    KNOWN_DEFAULT_SECRETS.includes(value)
  ) {
    throw new Error(
      `${name} uses a publicly known default value. Generate one with \`openssl rand -base64 32\`.`
    );
  }
  return value;
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: requireSecret("JWT_SECRET"),
      cookieSecret: requireSecret("COOKIE_SECRET"),
    },
  },
  modules: {
    [COMPANY_MODULE]: {
      resolve: "./modules/company",
    },
    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },
    [APPROVAL_MODULE]: {
      resolve: "./modules/approval",
    },
  },
});
