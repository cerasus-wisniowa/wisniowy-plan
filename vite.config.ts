import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vitePluginSvgr from "vite-plugin-svgr";
import { reactRouter } from "@react-router/dev/vite";
import pkg from "./package.json" with { type: "json" };

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
});
