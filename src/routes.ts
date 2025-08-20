import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	index("./routes/home.tsx"),
	layout("./layout/table-page.tsx", [
		route("/plan/:type?/:name?", "./routes/plan/plan.tsx"),
		route("/zastepstwa", "./routes/zastepstwa/zastepstwa.tsx"),
	]),
] satisfies RouteConfig;
