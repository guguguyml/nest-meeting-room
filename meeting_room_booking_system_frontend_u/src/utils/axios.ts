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
			(error: any) => {
				message.error(
					error.response.data.data || "系统繁忙，请稍后再试"
				);
				return Promise.reject(error.response.data);
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

export default request;
