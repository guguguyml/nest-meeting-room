import { Layout } from "@/layout/index";
import { Menu } from "@/layout/Menu";
import { ModifyMenu } from "@/layout/ModifyMenu";
import { ErrorPage } from "@/layout/ErrorPage";
import { Login } from "@/pages/users/Login";
import { Register } from "@/pages/users/Register";

import { UserManage } from "@/pages/users/UserManage";
import { InfoModify } from "@/pages/users/InfoModify";
import { PasswordModify } from "@/pages/users/PasswordModify";
import { MeetingRoomManage } from "@/pages/meeting-room/MeetingRoomManage";
import { BookingManage } from "@/pages/meeting-room/BookingManage";
import { Statistics } from "@/pages/meeting-room/Statistics";

export const routes = [
	{
		path: "/",
		element: <Layout></Layout>,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Menu></Menu>,

				children: [
					{
						path: "/",
						element: <MeetingRoomManage />,
					},
					{
						path: "user_manage",
						element: <UserManage />,
					},
					{
						path: "meeting_room_manage",
						element: <MeetingRoomManage />,
					},
					{
						path: "booking_manage",
						element: <BookingManage />,
					},
					{
						path: "statistics",
						element: <Statistics />,
					},
				],
			},
			{
				path: "/user",
				element: <ModifyMenu></ModifyMenu>,
				children: [
					{
						path: "info_modify",
						element: <InfoModify />,
					},
					{
						path: "password_modify",
						element: <PasswordModify />,
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
];
