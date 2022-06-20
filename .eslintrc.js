module.exports = {
    env: {
        browser: true,
    },
    globals: {
        Iterable: false,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:unicorn/recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'prettier',
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
        },
        react: {
            version: 'detect',
        },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.ts', '.tsx'],
    },
    plugins: ['@typescript-eslint', 'react', 'unicorn', 'import', 'prettier'],
    rules: {
        'no-param-reassign': ['error'],
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        'prettier/prettier': 'error',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'unknown',
                ],
            },
        ],
        'import/prefer-default-export': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/prefer-object-from-entries': 'off',
        'unicorn/prevent-abbreviations': 'off',
    },
    overrides: [
        {
            files: ['**/*.tsx'],
            rules: {
                'unicorn/filename-case': 'off',
            },
        },
        {
            files: ['src/react-app-env.d.ts'],
            rules: {
                'unicorn/prevent-abbreviations': 'off',
            },
        },
    ],
}
