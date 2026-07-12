import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // アプリ実行時の接続URL（pgbouncer経由）
    url: process.env.DATABASE_URL,
  },
});