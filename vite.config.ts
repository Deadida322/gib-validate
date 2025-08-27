import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dts({
			include: ['src'],
			entryRoot: 'src/',
			exclude: ['**/*.test.ts', 'eslint.config.ts', '*.config.ts'],
			insertTypesEntry: true,
			rollupTypes: true
		}),

		checker({
			typescript: true,
			eslint: {
				useFlatConfig: true,
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
				dev: {
					logLevel: ['error']
				}
			}
		})
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'gib-validate',
			fileName: (format) => `gib-validate.${format}.js`
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		reporters: ['default'],
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html']
		}
	}
});
