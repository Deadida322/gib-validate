import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		ignores: ['dist'],
		rules: {
			quotes: [0, 'single'],
			'@typescript-eslint/no-unused-vars': [
				'warn', // or "error"
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'arrow-body-style': ['error', 'as-needed']
		}
	},
	{},
	eslintPluginPrettierRecommended
);
