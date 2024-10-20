import antfu from '@antfu/eslint-config'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
export default antfu({
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  vue: true,
  ignores: ['dist', 'node_modules', '*.config.{js,ts,cjs,mjs}'],
  formatters: {
    css: true,
  },
  stylistic: {
    quotes: 'single',
    semi: false,
    jsx: true,
    overrides: {
      'no-prototype-builtins': 'off',
      'unused-imports/no-unused-vars':'off',
      'accessor-pairs':'off',
      'no-dupe-keys': 'off',
      'perfectionist/sort-imports': 'off',
      'sort-imports': 'off',
      'import/first': 'error',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
        },
      ],
      'antfu/curly': 'error',
      'eqeqeq': 'error',
      "import/consistent-type-specifier-style": ['error','prefer-top-level'],
      'ts/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      'ts/no-unsafe-return': 'off',
      'ts/consistent-indexed-object-style': 'error',
      'style/key-spacing': 'off',
      'ts/promise-function-async': 'off',
      'ts/array-type': 'error',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unused-expressions': 'off',
      'ts/consistent-type-imports': 'off',
      'no-console': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-call': 'off',
      'node/prefer-global/process': 'off',
      'ts/no-floating-promises': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/restrict-template-expressions': 'off',
      'ts/no-use-before-define': 'off',
      'ts/no-use-before-define': 'off',
      'ts/strict-boolean-expressions': 'off',
      'ts/no-namespace': 'off',
      'ts/no-unsafe-function-type':'off',
      'ts/no-non-null-asserted-optional-chain':'off',
      'vue/eqeqeq': 'error',
      'ts/no-misused-promises':'off',
      'prefer-promise-reject-errors':'off'
    }
  },
}, {
  ...pluginPrettier,
  rules: {
    'format/prettier':'off'
  }
})
