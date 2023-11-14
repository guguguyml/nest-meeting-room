import axios from "axios";

import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";

import { message } from "antd";

// import envConfig from "../../config"

// const MODE = import.meta.env.MODE

type Result<T> = {
	code: number;
	message: string;
	data: T;
};

interface PendingTask {
	config: AxiosRequestConfig;
	resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

class Request {
	instance: AxiosInstance;
	baseConfig: AxiosRequestConfig = {
		// baseURL: envConfig[MODE].apiBaseUrl,
		baseURL: "http://localhost:23910/",
		timeout: 5000,
	};
	constructor(config: AxiosRequestConfig = {}) {
		this.instance = axios.create(Object.assign(this.baseConfig, config));

		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// 配置headers等
				const accessToken = sessionStorage.getItem("access_token");

				if (accessToken) {
					config.headers.authorization = "Bearer " + accessToken;
				}
				return config;
			},
			(error: any) => {
				return Promise.reject(error);
			}
		);

		this.instance.interceptors.response.use(
			(res: AxiosResponse) => {
				return res?.data || true;
			},
			async (error: any) => {
				if (!error.response) {
					return Promise.reject(error);
				}
				let { data, config } = error.response;

				if (
					data.code === 401 &&
					config.url.includes("/user/admin/refresh/token")
				) {
					return error.response.data;
				}

				if (refreshing) {
					return new Promise(resolve => {
						queue.push({
							config,
							resolve,
						});
					});
				}

				if (
					data.code === 401 &&
					!config.url.includes("/user/admin/refresh/token")
				) {
					refreshing = true;
					const res = await refreshToken();
					refreshing = false;
					if (res.code === 200) {
						queue.forEach(({ config, resolve }) => {
							resolve(this.instance(config));
						});
						return this.instance(config);
					} else {
						if (typeof res.data === "string") {
							message.error(res.data);
						}

						setTimeout(() => {
							window.location.href = "/login";
						}, 1500);
						return error.response.data;
					}
				} else {
					message.error(
						error.response.data.data || "系统繁忙，请稍后再试"
					);
					return error.response.data;
				}
			}
		);
	}

	public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
		return this.instance.request(config);
	}

	public get<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<Result<T>> {
		return this.instance.get(url, config);
	}

	public post<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<Result<T>> {
		return this.instance.post(url, data, config);
	}

	public put<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<Result<T>> {
		return this.instance.put(url, data, config);
	}

	public delete<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<Result<T>> {
		return this.instance.delete(url, config);
	}
}

const request = new Request();

interface IToken {
	access_token: string;
	refresh_token: string;
}
async function refreshToken() {
	const res = await request.get<IToken | string>(
		"/user/admin/refresh/token",
		{
			params: {
				refreshToken: sessionStorage.getItem("refresh_token"),
			},
		}
	);
	if (typeof res.data !== "string") {
		sessionStorage.setItem("access_token", res.data!.access_token || "");
		sessionStorage.setItem("refresh_token", res.data!.refresh_token || "");
	}
	return res;
}

export default request;
