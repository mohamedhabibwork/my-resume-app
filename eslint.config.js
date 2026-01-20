import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.wrangler/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'public/*.js', // Service workers
      'public/**/*.js',
    ],
  },

  // Base ESLint recommended
  eslint.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Vue recommended
  ...pluginVue.configs['flat/recommended'],

  // Vue + TypeScript specific config
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
  },

  // Browser globals for TypeScript files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Custom rules for all files
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/block-order': [
        'error',
        { order: ['script', 'template'] },
      ],
      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' },
          style: { allowNoLang: false }, // Disallow style blocks
        },
      ],
      // Disallow style blocks in Vue components - CSS only in assets/
      'vue/no-restricted-block': [
        'error',
        {
          element: 'style',
          message: 'CSS is not allowed in Vue components. Use Tailwind classes or add CSS to src/assets/*.css files.',
        },
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/padding-line-between-blocks': 'error',
      'vue/no-unused-refs': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },

  // Server-side specific rules
  {
    files: ['server/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  }
)
