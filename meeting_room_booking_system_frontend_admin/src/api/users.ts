import request from "@/utils/axios";
import {
	IRegisterUser,
	ILoginResponse,
	ILoginUser,
	IUpdatePassword,
	IUpdateUserInfo,
	IUserInfo,
	UserSearchResponse,
} from "@/interfaces/users";

/**
 * 管理员登录接口
 */
export const login = (params: ILoginUser) =>
	request.post<ILoginResponse>(`/user/admin/login`, params);

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
	request.post<string>("/user/admin/update/password", data);

/**
 * 用户获取密码的邮箱验证码
 */
export const updatePasswordCaptcha = (email: string) =>
	request.get<string>("/user/update/password/captcha", {
		params: {
			address: email,
		},
	});

/**
 * 获取用户信息
 */
export const getUserInfo = () => request.get<IUserInfo>("/user/info");

/**
 * 用户更新信息
 */
export const updateUserInfo = (data: IUpdateUserInfo) =>
	request.post<string>("/user/admin/update", data);
/**
 * 用户获取更新用户信息的邮箱验证码
 */
export const getUpdateUserCaptcha = () =>
	request.get<string>("/user/update/captcha");

/**
 * 获取用户列表
 */
type UserSearchResponseType = UserSearchResponse | string;
export const userSearch = (
	username: string,
	nickName: string,
	email: string,
	pageNo: number,
	pageSize: number
) =>
	request.get<UserSearchResponseType>("/user/list", {
		params: {
			username,
			nickName,
			email,
			pageNo,
			pageSize,
		},
	});
/**
 * 冻结用户
 */
export const freezeUser = (id: number) =>
	request.get<string>("/user/freeze", {
		params: {
			id,
		},
	});
