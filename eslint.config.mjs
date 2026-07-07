import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const FEATURES = [
  "auth",
  "recruitments",
  "applications",
  "groups",
  "messages",
  "notifications",
  "profiles",
];

// feature間の直接importを禁止するルール
// 他featureを使う場合は必ずそのfeatureのindex.ts経由
const featureBoundaryRules = FEATURES.flatMap((feature) =>
  FEATURES.filter((other) => other !== feature).map((other) => ({
    target: `**/features/${feature}/**`,
    from: `**/features/${other}/!(index)`,
    message: `feature '${feature}' から '${other}' への直接importは禁止。${other}/index.ts 経由でimportしてください。`,
  }))
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "docs/**", // 設計モック（metoo-ui-v2.tsx）はビルド対象外
  ]),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        { zones: featureBoundaryRules },
      ],
    },
  },
]);

export default eslintConfig;
