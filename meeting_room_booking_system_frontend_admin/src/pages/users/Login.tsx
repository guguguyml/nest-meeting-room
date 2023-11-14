import { Button, Form, Input, message } from "antd";
import "./login.css";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/users";
import { ILoginUser } from "@/interfaces/users";

const layout1 = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
};

export function Login() {
	const navigate = useNavigate();

	const onFinish = useCallback(async (values: ILoginUser) => {
		try {
			const res = await login(values);
			const { code, data } = res;
			if (code === 201 || code === 200) {
				message.success("登录成功");
				sessionStorage.setItem("access_token", data.accessToken);
				sessionStorage.setItem("refresh_token", data.refreshToken);
				sessionStorage.setItem(
					"user_info",
					JSON.stringify(data.userInfo)
				);
				setTimeout(() => {
					navigate("/");
				}, 1500);
			}
		} catch (error) {}
		//	eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="login-container">
			<h1>会议室预订系统</h1>
			<Form
				{...layout1}
				onFinish={onFinish}
				colon={false}
				autoComplete="off"
			>
				<Form.Item
					label="用户名"
					name="username"
					rules={[{ required: true, message: "请输入用户名!" }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="密码"
					name="password"
					rules={[{ required: true, message: "请输入密码!" }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item label=" ">
					<Button className="btn" type="primary" htmlType="submit">
						登录
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
