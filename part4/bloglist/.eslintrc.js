module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'eqeqeq': "error",
        'no-trailing-spaces': "error",
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
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
    },
    "overrides": [
        {
            "files": [
                "*/*.test.js",
                "*/*.test.jsx"
            ],
            "env": {
                "jest": true
            }
        }
    ]
}
