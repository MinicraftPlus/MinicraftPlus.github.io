import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// fallback: '404.html', // Not working on GitHub Pages
			// Instead, "404" route is used
			// More info: https://github.com/sveltejs/kit/issues/1209#issuecomment-1765621042
			pages: './build',
			assets: './build',
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		files: {
			routes: process.argv.includes('dev') ? "src/dev" : "src/routes",
		}
	},
	preprocess: vitePreprocess()
};

export default config;
