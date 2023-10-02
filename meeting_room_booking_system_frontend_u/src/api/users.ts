import request from "@/utils/axios";
import {
	IRegisterUser,
	ILoginResponse,
	ILoginUser,
	IUpdatePassword,
} from "@/interfaces/users";

/**
 * 用户登录接口
 */
export const login = (params: ILoginUser) =>
	request.post<ILoginResponse>(`/user/login`, params);

/**
 * 用户获取注册邮箱验证码
 */
export const registerCaptcha = (email: string) =>
	request.get<string>("/user/register/captcha", {
		params: {
			address: email,
		},
	});

/**
 * 用户注册接口
 */
export const register = (registerUser: IRegisterUser) =>
	request.post<string>("/user/register", registerUser);

/**
 * 用户更新密码
 */
export const updatePassword = (data: IUpdatePassword) =>
	request.post<string>("/user/update/password", data);

/**
 * 用户获取密码的邮箱验证码
 */
export const updatePasswordCaptcha = (email: string) =>
	request.get<string>("/user/update/password/captcha", {
		params: {
			address: email,
		},
	});
