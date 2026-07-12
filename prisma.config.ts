import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // アプリ実行時の接続URL（pgbouncer経由）
    url: process.env.DATABASE_URL,
  },
});
