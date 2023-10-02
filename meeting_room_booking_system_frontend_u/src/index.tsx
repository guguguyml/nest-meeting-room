import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { routes } from "./router/index";

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
