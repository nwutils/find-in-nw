/**
 * @file    Linting rules, plugins, and configurations
 * @author  TheJaredWilcurt
 */

module.exports = {
  parserOptions: {
    ecmaVersion: 2022
  },
  env: {
    es6: true
  },
  extends: [
    'tjw-base'
  ]
};
