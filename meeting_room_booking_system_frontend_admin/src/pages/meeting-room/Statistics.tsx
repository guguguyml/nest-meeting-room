import { Button, DatePicker, Form, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "./statistics.css";
import { meetingRoomUsedCount, userBookingCount } from "@/api/meeting-room";
import {
	IUserBookingCount,
	IMeetingRoomUsedCount,
} from "@/interfaces/meeting-room";

export function Statistics() {
	const containerRef = useRef<HTMLDivElement>(null);
	const containerRef2 = useRef<HTMLDivElement>(null);
	const [userBookingData, setUserBookingData] =
		useState<Array<IUserBookingCount>>();
	const [meetingRoomUsedData, setMeetingRoomUsedData] =
		useState<Array<IMeetingRoomUsedCount>>();

	const [form] = useForm();

	async function getStatisticData(values: {
		startTime: string;
		endTime: string;
	}) {
		const startTime = dayjs(values.startTime).format("YYYY-MM-DD");
		const endTime = dayjs(values.endTime).format("YYYY-MM-DD");

		const res = await userBookingCount(startTime, endTime);

		const { data, code } = res;
		if (code === 201 || code === 200) {
			setUserBookingData(data as IUserBookingCount[]);
		} else {
			message.error((data as string) || "系统繁忙，请稍后再试");
		}

		const res2 = await meetingRoomUsedCount(startTime, endTime);

		const { data: data2, code: code2 } = res2;
		if (code2 === 201 || code2 === 200) {
			setMeetingRoomUsedData(data2 as IMeetingRoomUsedCount[]);
		} else {
			message.error((data2 as string) || "系统繁忙，请稍后再试");
		}
	}

	useEffect(() => {
		const myChart = echarts.init(containerRef.current);

		if (!userBookingData) {
			return;
		}

		myChart.setOption({
			title: {
				text: "用户预定情况",
			},
			tooltip: {},
			xAxis: {
				data: userBookingData?.map(
					(item: IUserBookingCount) => item.username
				),
			},
			yAxis: {},
			series: [
				{
					name: "预定次数",
					type: form.getFieldValue("chartType"),
					data: userBookingData?.map((item: IUserBookingCount) => {
						return {
							name: item.username,
							value: item.bookingCount,
						};
					}),
				},
			],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userBookingData]);
	useEffect(() => {
		const myChart = echarts.init(containerRef2.current);

		if (!meetingRoomUsedData) {
			return;
		}

		myChart.setOption({
			title: {
				text: "会议室使用情况",
			},
			tooltip: {},
			xAxis: {
				data: meetingRoomUsedData?.map(item => item.meetingRoomName),
			},
			yAxis: {},
			series: [
				{
					name: "使用次数",
					type: form.getFieldValue("chartType"),
					data: meetingRoomUsedData?.map(item => {
						return {
							name: item.meetingRoomName,
							value: item.usedCount,
						};
					}),
				},
			],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [meetingRoomUsedData]);

	return (
		<div id="statistics-container">
			<div className="statistics-form">
				<Form
					form={form}
					onFinish={getStatisticData}
					name="search"
					layout="inline"
					colon={false}
				>
					<Form.Item
						label="开始日期"
						name="startTime"
						rules={[
							{
								required: true,
								message: "请选择开始日期",
							},
						]}
					>
						<DatePicker />
					</Form.Item>

					<Form.Item
						label="结束日期"
						name="endTime"
						rules={[
							{
								required: true,
								message: "请选择结束日期",
							},
						]}
					>
						<DatePicker />
					</Form.Item>

					<Form.Item
						label="图表类型"
						name="chartType"
						initialValue={"bar"}
					>
						<Select>
							<Select.Option value="pie">饼图</Select.Option>
							<Select.Option value="bar">柱形图</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className="statistics-chart">
				<div className="statistics-chart-item" ref={containerRef}></div>
				<div
					className="statistics-chart-item"
					ref={containerRef2}
				></div>
			</div>
		</div>
	);
}
