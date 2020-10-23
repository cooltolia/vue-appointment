module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
                'vue/script-indent': [
                    'warn',
                    4,
                    {
                        baseIndent: 1,
                    },
                ],
            },
        },
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
            },
        },
    },
};
