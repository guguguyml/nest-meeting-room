import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import "./login.css";
import { login } from "@/api/users";
import { ILoginUser } from "@/interfaces/users";

// import data from "@/1.json";

const formLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
};

const formItemLayout = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
};

// function importJson(file: any) {
// 	return new Promise((resolve, reject) => {
// 		let reader = new FileReader();
// 		reader.readAsText(file.raw);

// 		reader.onload = function (e: any) {
// 			const data = JSON.parse(e!.target!.result); //转成JSON对象
// 			console.log("check ", data);

// 			if (data) {
// 				resolve(data);
// 			} else {
// 				reject(false);
// 			}
// 		};
// 	});
// }

export function Login() {
	const navigate = useNavigate();

	const onFinish = useCallback(async (values: ILoginUser) => {
		// console.log(data);
		// let num = 0;
		// let errors = [];
		// for await (let item of data) {
		// 	const res = await setData(item);
		// 	num++;
		// 	if (res.data === "添加失败") {
		// 		errors.push(item);
		// 	}
		// 	console.log(num, "=============", res.data);
		// }
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
				{...formLayout}
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

				<Form.Item {...formItemLayout}>
					<div className="links">
						<Link to="/register">创建账号</Link>
						<Link to="/update-password">忘记密码</Link>
					</div>
				</Form.Item>

				<Form.Item {...formItemLayout}>
					<Button className="btn" type="primary" htmlType="submit">
						登录
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
