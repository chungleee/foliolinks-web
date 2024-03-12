import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./global.scss";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Login from "./pages/Auth/Login/Login.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{ path: "/dashboard", element: <Dashboard /> },
	{ path: "/login", element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
