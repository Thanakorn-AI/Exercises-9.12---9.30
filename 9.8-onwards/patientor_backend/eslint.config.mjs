import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'], // Lint all TypeScript files
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error', // Require semicolons
    '@typescript-eslint/no-unsafe-assignment': 'error', // Prevent unsafe assignments
    '@typescript-eslint/no-explicit-any': 'error', // No "any" type
    '@typescript-eslint/explicit-function-return-type': 'off', // Allow untyped returns
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow untyped exports
    '@typescript-eslint/restrict-template-expressions': 'off', // Flexible strings
    '@typescript-eslint/restrict-plus-operands': 'off', // Flexible addition
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' } // Ignore unused vars starting with "_"
    ],
  },
  ignores: ["build/*"] // Don’t lint compiled files
});