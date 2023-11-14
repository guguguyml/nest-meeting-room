import { Button, Form, Input, Table, message, Image, Badge } from "antd";
import { useCallback, useState, useEffect, useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import "./UserManage.css";
import { SearchUser, IUserInfo } from "@/interfaces/users";
import { userSearch, freezeUser as freeze } from "@/api/users";

export function UserManage() {
	const [pageNo, setPageNo] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [userResult, setUserResult] = useState<IUserInfo[]>();
	const [num, setNum] = useState(0);

	const columns: ColumnsType<IUserInfo> = useMemo(
		() => [
			{
				title: "用户名",
				dataIndex: "username",
			},
			{
				title: "头像",
				dataIndex: "headPic",
				render: value => {
					return value ? (
						<Image
							width={50}
							src={`http://localhost:23910/${value}`}
						/>
					) : (
						""
					);
				},
			},
			{
				title: "昵称",
				dataIndex: "nickName",
			},
			{
				title: "邮箱",
				dataIndex: "email",
			},
			{
				title: "注册时间",
				dataIndex: "createTime",
			},
			{
				title: "状态",
				dataIndex: "isFrozen",
				render: (_, record) =>
					record.isFrozen ? (
						<Badge status="success">已冻结</Badge>
					) : (
						""
					),
			},

			{
				title: "操作",
				render: (_, record) => (
					<Button
						type="link"
						block
						onClick={() => {
							freezeUser(record.id);
						}}
					>
						冻结
					</Button>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const freezeUser = useCallback(async (id: number) => {
		const res = await freeze(id);

		const { data } = res;
		if (res.code === 201 || res.code === 200) {
			message.success("冻结成功");
			setNum(Math.random());
		} else {
			message.error(data || "系统繁忙，请稍后再试");
		}
	}, []);

	useEffect(() => {
		searchUser({
			username: "",
			email: "",
			nickName: "",
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageNo, pageSize, num]);

	const changePage = useCallback(function (pageNo: number, pageSize: number) {
		setPageNo(pageNo);
		setPageSize(pageSize);
	}, []);

	const searchUser = useCallback(async (values: SearchUser) => {
		try {
			const res = await userSearch(
				values.username,
				values.nickName,
				values.email,
				pageNo,
				pageSize
			);

			const { data, code } = res;
			const isString = typeof data === "string";
			if (code === 201 || code === 200) {
				if (!isString) {
					setUserResult(
						data!.users.map((item: IUserInfo) => {
							return {
								key: item.username,
								...item,
							};
						})
					);
				}
			} else {
				if (isString) {
					message.error(data || "系统繁忙，请稍后再试");
				}
			}
		} catch (error) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="userManage-container">
			<div className="userManage-form">
				<Form
					onFinish={searchUser}
					name="search"
					layout="inline"
					colon={false}
				>
					<Form.Item label="用户名" name="username">
						<Input />
					</Form.Item>

					<Form.Item label="昵称" name="nickName">
						<Input />
					</Form.Item>

					<Form.Item
						label="邮箱"
						name="email"
						rules={[
							{ type: "email", message: "请输入合法邮箱地址!" },
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item label=" ">
						<Button type="primary" htmlType="submit">
							搜索用户
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className="userManage-table">
				<Table
					columns={columns}
					dataSource={userResult}
					pagination={{
						current: pageNo,
						pageSize: pageSize,
						onChange: changePage,
					}}
				/>
			</div>
		</div>
	);
}
