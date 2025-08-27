import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';
// import stylelint from "vite-plugin-stylelint";

export default defineConfig({
	plugins: [
		vue(),
		checker({
			typescript: true,
			vueTsc: true,
			stylelint: {
				lintCommand: 'stylelint ./src/**/*.{css,vue} --fix'
			},
			eslint: {
				// for example, lint .ts and .tsx
				useFlatConfig: true,
				lintCommand: 'eslint "./src/**/*.{js,vue,html}"',
				dev: {
					logLevel: ['error']
				}
			}
		})
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		},
		extensions: ['.ts', '.js', '.json']
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or "modern"
			}
		}
	}

	// server: {
	//   fs: {
	//     allow: [
	//       // search up for workspace root
	//       searchForWorkspaceRoot(process.cwd()),
	//       // your custom rules
	//       '/path/to/custom/allow',
	//     ],
	//   },
	// },
});
