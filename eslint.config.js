const js = require('@eslint/js');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
    js.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'commonjs'
        }
    },
    {
        files: ['**/*.mjs'],
        languageOptions: {
            sourceType: 'module'
        }
    },
    {
        files: ['**/*.mts'],
        languageOptions: {
            parser: typescriptParser,
            sourceType: 'module'
        }
    },
    {
        files: ['**/*.d.mts'],
        languageOptions: {
            parser: typescriptParser,
            sourceType: 'module'
        },
        rules: {
            'no-unused-vars': ['error', { args: 'none' }]
        }
    }
];
