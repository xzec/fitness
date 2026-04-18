import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig(
    {
        ignores: ['eslint.config.mjs', '**/dist/**', '**/node_modules/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            'prettier/prettier': [
                'error',
                {},
                {
                    usePrettierrc: true,
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
)
