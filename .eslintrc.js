module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/prefer-interface": 0,
    "curly": [
      "error",
      "all"
    ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "complexity": [
      "error",
      8
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": true,
        "optionalDependencies": false,
        "peerDependencies": false
      }
    ],
    "no-shadow": [
      "error",
      {
        "hoist": "all"
      }
    ],
    "prefer-const": "error",
    "import/order": [
      "error",
      {
        "groups": [
          [
            "external",
            "builtin"
          ],
          "internal",
          [
            "parent",
            "sibling",
            "index"
          ]
        ]
      }
    ],
    "sort-imports": [
      "error",
      {
        "ignoreCase": true,
        "ignoreDeclarationSort": true,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": [
          "none",
          "all",
          "multiple",
          "single"
        ]
      }
    ],
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/strict-boolean-expressions": "error"
  },
  "root": true,
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "plugins": [
    "import"
  ]
}