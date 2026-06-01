import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  jsdoc.configs["flat/recommended-typescript"],
  {
    rules: {
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: false,
            ClassExpression: false,
            FunctionDeclaration: true,
            FunctionExpression: false,
            MethodDefinition: false,
          },
        },
      ],
      "jsdoc/require-param": "warn",
      "jsdoc/require-returns": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated shadcn/ui boilerplate (not project-authored):
    "src/components/ui/**",
    "src/lib/utils.ts",
  ]),
]);

export default eslintConfig;
