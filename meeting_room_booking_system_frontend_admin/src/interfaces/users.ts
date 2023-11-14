export interface ILoginUser {
	username: string;
	password: string;
}
export interface ILoginResponse {
	accessToken: string; // 确保响应中有 code 属性
	refreshToken: string;
	userInfo: IUserInfo; // 这里可以是登录成功后返回的数据
}

export interface IRegisterUser {
	username: string;
	nickName: string;
	password: string;
	confirmPassword: string;
	email: string;
	captcha: string;
}

export interface IUpdatePassword {
	username: string;
	email: string;
	captcha: string;
	password: string;
	confirmPassword: string;
}

export interface IUpdateUserInfo {
	headPic: string;
	nickName: string;
	email: string;
	captcha: string;
}
export interface IUpdateUserInfoResponse {
	userInfo: IUserInfo;
	accessToken: string;
	refreshToken: string;
}

export interface IUserInfo {
	isAdmin?: boolean;
	roles?: string[];
	permissions?: string;
	headPic: string;
	nickName: string;
	email: string;
	createTime: string;
	id: number;
	isFrozen: boolean;
	phoneNumber: string;
	username: string;
}

export interface SearchUser {
	username: string;
	nickName: string;
	email: string;
}

export interface UserSearchResponse {
	totalCount: number;
	users: IUserInfo[];
}
