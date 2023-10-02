import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import "./register.css";
import { register, registerCaptcha } from "@/api/users";
import { useForm } from "antd/es/form/Form";
import { IRegisterUser } from "@/interfaces/users";

const formLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};

const formItemLayout = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
};

export function Register() {
	const [form] = useForm();
	const navigate = useNavigate();

	const sendCaptcha = useCallback(async function () {
		const address = form.getFieldValue("email");
		if (!address) {
			return message.error("请输入邮箱地址");
		}
		try {
			const res = await registerCaptcha(address);
			if (res.code === 201 || res.code === 200) {
				message.success(res.data);
			}
		} catch (error) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onFinish = useCallback(async (values: IRegisterUser) => {
		if (values.password !== values.confirmPassword) {
			return message.error("两次密码不一致");
		}
		try {
			const res = await register(values);

			if (res.code === 201 || res.code === 200) {
				message.success("注册成功");
				setTimeout(() => {
					navigate("/login");
				}, 1500);
			}
		} catch (error) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="register-container">
			<h1>会议室预订系统</h1>
			<Form
				form={form}
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
					label="昵称"
					name="nickName"
					rules={[{ required: true, message: "请输入昵称!" }]}
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

				<Form.Item
					label="确认密码"
					name="confirmPassword"
					rules={[{ required: true, message: "请输入确认密码!" }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="邮箱"
					name="email"
					rules={[
						{ required: true, message: "请输入邮箱!" },
						{ type: "email", message: "请输入合法邮箱地址!" },
					]}
				>
					<Input />
				</Form.Item>

				<div className="captcha-wrapper">
					<Form.Item
						label="验证码"
						name="captcha"
						rules={[{ required: true, message: "请输入验证码!" }]}
					>
						<Input />
					</Form.Item>
					<Button type="primary" onClick={sendCaptcha}>
						发送验证码
					</Button>
				</div>

				<Form.Item {...formItemLayout}>
					<div className="links">
						已有账号？去<Link to="/login">登录</Link>
					</div>
				</Form.Item>

				<Form.Item {...formLayout} label=" ">
					<Button className="btn" type="primary" htmlType="submit">
						注册
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
