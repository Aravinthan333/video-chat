import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import vitest from '@vitest/eslint-plugin'

export default tseslint.config(
    preferArrowFunctions.configs.all,
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        ignores: ['./src/baml_client/**/*.ts', '**/prisma/prismaclient/**'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            vitest
        },
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                ...vitest.environments.env.globals,
                ...globals.node,
                HTMLElement: 'readonly'
            }
        },
        linterOptions: { noInlineConfig: true },
        rules: {
            semi: [2, 'never'],
            indent: 'off',
            'comma-dangle': ['error', 'never'],
            'operator-linebreak': 0,
            'implicit-arrow-linebreak': 0,
            'function-paren-newline': 0,
            'max-lines': ['warn', 50],
            'max-depth': ['error', 3],
            'max-statements': ['warn', 6],
            'object-curly-newline': 0,
            'import/prefer-default-export': 0,
            radix: 'off',
            'consistent-return': 'off',
            'no-unused-vars': 'off',
            'no-redeclare': 'warn',
            complexity: ['warn', { max: 3 }]
        }
    },
    {
        files: [
            '**/*.test.ts',
            '**/models/reports/**/*.test.ts',
            '**/ocr/service/*.test.ts',
            '**/ocr/testFactory/*.ts'
        ],
        rules: {
            complexity: ['warn', 3],
            'max-lines': ['warn', 200],
            'max-statements': ['warn', 42],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['**/models/testFactory/**/*.ts'],
        rules: {
            complexity: ['off'],
            'max-lines': ['warn', 50],
            'max-statements': ['warn', 20],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['**/models/reports/**/*.ts'],
        rules: {
            'max-lines': ['warn', 50],
            'max-statements': ['warn', 50]
        }
    },
    {
        files: ['**/models/reports/**/*.test.ts'],
        plugins: { vitest },
        rules: {
            'max-lines': ['warn', 200],
            'max-statements': ['warn', 200]
        }
    },
    {
        files: [
            '**/controller/**/testVariables.ts',
            '**/domain/**/testVariables.ts',
            '**/ocr/**/testVariables.ts'
        ],
        rules: {
            'max-lines': ['warn', 200],
            'max-statements': ['warn', 200]
        }
    }
)
