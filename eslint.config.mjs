import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
	{
		ignores: ['.next/**', 'node_modules/**', 'dist/**', 'out/**', 'build/**', '*.tsbuildinfo'],
	},
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			prettier: prettierPlugin,
			'@next/next': nextPlugin,
		},
		rules: {
			// TypeScript recommended rules
			...tsPlugin.configs['recommended'].rules,

			// Next.js recommended rules
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs['core-web-vitals'].rules,

			// Prettier integration — reports formatting issues as ESLint errors
			'prettier/prettier': 'error',

			// TypeScript-specific overrides
			'no-undef': 'off', // TypeScript handles this
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			// General quality rules
			// 'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
		},
	},
	// Disable any rules that conflict with Prettier formatting
	prettierConfig,
];

export default config;
