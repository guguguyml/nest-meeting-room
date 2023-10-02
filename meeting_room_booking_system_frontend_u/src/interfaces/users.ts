export interface ILoginUser {
	username: string;
	password: string;
}
export interface ILoginResponse {
	accessToken: string; // 确保响应中有 code 属性
	refreshToken: string;
	userInfo: any; // 这里可以是登录成功后返回的数据
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
