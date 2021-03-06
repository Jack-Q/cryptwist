// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: 'airbnb-base',
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    'no-mixed-operators': 0,
    'no-console': 0,
    'no-bitwise': 0,
    'no-plusplus': 0,
    'no-throw-literal': 0,
    'prefer-destructuring': [
      'error',
      {
        'AssignmentExpression': {
          'array': false,
        }
      }
    ],
    'no-param-reassign': [2, {
      "props": false
    }],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
