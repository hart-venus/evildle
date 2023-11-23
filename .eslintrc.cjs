module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'xo',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	rules: {
		'jsx-quotes': ['error', 'prefer-single'],
		'operator-linebreak': ['error', 'after'],
		'react/react-in-jsx-scope': 'off',
		'prettier/prettier': ['error', {singleQuote: true}],
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
				],
				pathGroups: [
					{
						pattern: 'react',
						group: 'external',
						position: 'before',
					},
				],
				pathGroupsExcludedImportTypes: ['react'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		quotes: [
			'error',
			'single',
			{avoidEscape: true, allowTemplateLiterals: true},
		],
	},
	plugins: ['@typescript-eslint', 'react', 'eslint-plugin-import', 'prettier'],
	settings: {react: {pragma: 'h', version: 'detect'}},
	// Exclude files
	ignorePatterns: ['vite.config.ts'],
};
