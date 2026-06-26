import tseslint from 'typescript-eslint';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
	globalIgnores([
		'node_modules',
		'dist',
		'esbuild.config.mjs',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'data.json',
		'package.json',
		'pnpm-lock.yaml',
		'tsconfig.json',
	]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mts', 'manifest.json'],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		rules: {
			// Disabled: our UI copy is full of proper nouns and technical
			// identifiers (Ollama, OpenAI, OpenRouter, LM Studio, model names like
			// `gemma3`, the `sk-...` key prefix, CodeMirror key names such as
			// `Tab ArrowRight`). The auto-suggestions mangle these (e.g.
			// `gemma3` -> `Gemma3`, `Ollama` -> `ollama`), so the rule does more
			// harm than good here.
			'obsidianmd/ui/sentence-case': 'off',
		},
	},
);
