// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    [
        globalIgnores([".next/*", "next-env.d.ts"]),
        {
            rules: {
                semi: "error",
                "prefer-const": "error",
            },
        },
    ]
);