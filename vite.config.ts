import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vitePluginSvgr from "vite-plugin-svgr";
import { reactRouter } from "@react-router/dev/vite";
import pkg from "./package.json" with { type: "json" };
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), vitePluginSvgr(), reactRouter()],
	build: {
		emptyOutDir: true,
		outDir: "dist",
	},
	define: {
		__VERSION__: `"${pkg.version}"`,
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
