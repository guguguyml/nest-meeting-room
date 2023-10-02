import { Layout } from "@/layout/index";
import { ErrorPage } from "@/layout/ErrorPage";
import { Login } from "@/pages/users/Login";
import { Register } from "@/pages/users/Register";
import { UpdatePassword } from "@/pages/users/UpdatePassword";

export const routes = [
	{
		path: "/",
		element: <Layout></Layout>,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "aaa",
				element: <div>aaa</div>,
			},
			{
				path: "bbb",
				element: <div>bbb</div>,
			},
		],
	},
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "register",
		element: <Register />,
	},
	{
		path: "update_password",
		element: <UpdatePassword />,
	},
];
