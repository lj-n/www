import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import deno from "@astrojs/deno";

export default defineConfig({
	integrations: [react()],
	output: "server",
	adapter: deno(),
	markdown: {
		shikiConfig: {
			langs: ['js'],
			wrap: true,
			theme: 'vitesse-dark'
		},
	},
});
