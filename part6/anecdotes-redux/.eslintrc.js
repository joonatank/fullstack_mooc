module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'jest/globals': true
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react', 'jest'
    ],
    'rules': {
        'no-var': 'error',
        'max-len': ['error', {'code': 90}],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'no-case-declarations': 'off',
        'no-fallthrough': 'error',
        'eqeqeq': "error",
        'no-trailing-spaces': "error",
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0,
        'react/prop-types': 0,
        'indent': [
            'error',
            4,
            { 'MemberExpression': 'off' }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
