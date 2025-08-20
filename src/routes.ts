import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("./routes/home.tsx"),
	route("/plan/:type?/:name?", "./routes/plan/plan.tsx"),
	route("/zastepstwa", "./routes/zastepstwa/zastepstwa.tsx"),
] satisfies RouteConfig;
