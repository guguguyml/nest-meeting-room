import { Layout } from "@/layout/index";
import { ErrorPage } from "@/layout/ErrorPage";
import { Menu } from "@/layout/Menu";
import { Login } from "@/pages/users/Login";
import { Register } from "@/pages/users/Register";
import { UpdatePassword } from "@/pages/users/UpdatePassword";
import { UpdateInfo } from "@/pages/users/UpdateInfo";
import { MeetingRoomList } from "@/pages/meeting-room/MeetingRoomList";
import { BookingHistory } from "@/pages/meeting-room/BookingHistory";

export const routes = [
	{
		path: "/",
		element: <Layout></Layout>,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "update_info",
				element: <UpdateInfo />,
			},
			{
				path: "/",
				element: <Menu />,
				children: [
					{
						path: "/",
						element: <MeetingRoomList />,
					},
					{
						path: "meeting_room_list",
						element: <MeetingRoomList />,
					},
					{
						path: "booking_history",
						element: <BookingHistory />,
					},
				],
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
