import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.ts'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
