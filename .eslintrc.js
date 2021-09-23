module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'prettier/react',
    ],
    overrides: [
        {
            files: ["*.js", "*.jsx"],
            rules: {
                "@typescript-eslint/no-var-requires": 0,
                "@typescript-eslint/explicit-function-return-type": 0,
            }
        }
    ],
    settings: {
        'import/resolver': {
            alias: {
                map: ['./src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            typescript: {},
        },
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/jsx-filename-extension': [1, { extensions: ['tsx'] }],
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'prettier/prettier': 'error',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
};
