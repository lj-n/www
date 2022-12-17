import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import deno from "@astrojs/deno";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	integrations: [react(), svelte(), mdx()],
	output: "server",
	adapter: deno(),
	markdown: {
		shikiConfig: {
			langs: ["js"],
			wrap: true,
		},
	},
});
