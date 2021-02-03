module.exports = {
  plugins: ["prettier", "unicorn"],
  extends: [
    "airbnb-base",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/unicorn",
  ],
  env: {
    es6: true,
    browser: true,
  },
  rules: {
    "unicorn/prevent-abbreviations": "off",
    "no-use-before-define": ["error", { functions: false, classes: false }],
    "no-shadow": "off",
    "no-unused-vars": "off",
    "unicorn/consistent-function-scoping": "off",
    "no-undef": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "no-alert": "off",
    "no-unneeded-ternary": "off",
  },
};
