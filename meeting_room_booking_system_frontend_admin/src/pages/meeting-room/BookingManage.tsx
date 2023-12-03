/* eslint-disable jsx-a11y/anchor-is-valid */
import {
	Button,
	DatePicker,
	Form,
	Input,
	Popconfirm,
	Table,
	TimePicker,
	message,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import {
	IBookingSearchResponse,
	IBookingSearchResult,
	ISearchBooking,
} from "@/interfaces/meeting-room";
import { bookingList, apply, reject, unbind } from "@/api/meeting-room";
import "./booking_manage.css";
import dayjs from "dayjs";

export function BookingManage() {
	const [pageNo, setPageNo] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [bookingSearchResult, setBookingSearchResult] = useState<
		Array<IBookingSearchResult>
	>([]);
	const [num, setNum] = useState(0);

	const columns: ColumnsType<IBookingSearchResult> = [
		{
			title: "会议室名称",
			dataIndex: "room",
			render(_, record) {
				return record.room.name;
			},
		},
		{
			title: "会议室位置",
			dataIndex: "room",
			render(_, record) {
				return record.room.location;
			},
		},
		{
			title: "预定人",
			dataIndex: "user",
			render(_, record) {
				return record.user.username;
			},
		},
		{
			title: "开始时间",
			dataIndex: "startTime",
			render(_, record) {
				return dayjs(new Date(record.startTime)).format(
					"YYYY-MM-DD HH:mm:ss"
				);
			},
		},
		{
			title: "结束时间",
			dataIndex: "endTime",
			render(_, record) {
				return dayjs(new Date(record.endTime)).format(
					"YYYY-MM-DD HH:mm:ss"
				);
			},
		},
		{
			title: "审批状态",
			dataIndex: "status",
			onFilter: (value, record) =>
				record.status.startsWith(value as string),
			filters: [
				{
					text: "审批通过",
					value: "审批通过",
				},
				{
					text: "审批驳回",
					value: "审批驳回",
				},
				{
					text: "申请中",
					value: "申请中",
				},
				{
					text: "已解除",
					value: "已解除",
				},
			],
		},

		{
			title: "预定时间",
			dataIndex: "createTime",
			render(_, record) {
				return dayjs(new Date(record.createTime)).format(
					"YYYY-MM-DD hh:mm:ss"
				);
			},
		},
		{
			title: "备注",
			dataIndex: "note",
		},
		{
			title: "描述",
			dataIndex: "description",
		},
		{
			title: "操作",
			render: (_, record) => (
				<div>
					<Popconfirm
						title="通过申请"
						description="确认通过吗？"
						onConfirm={() => changeStatus(record.id, "apply")}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">通过</a>
					</Popconfirm>
					<br />
					<Popconfirm
						title="驳回申请"
						description="确认驳回吗？"
						onConfirm={() => changeStatus(record.id, "reject")}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">驳回</a>
					</Popconfirm>
					<br />
					<Popconfirm
						title="解除申请"
						description="确认解除吗？"
						onConfirm={() => changeStatus(record.id, "unbind")}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">解除</a>
					</Popconfirm>
					<br />
				</div>
			),
		},
	];

	const searchBooking = async (values: ISearchBooking) => {
		const res = await bookingList(values, pageNo, pageSize);

		const { data, code } = res;
		if (code === 201 || code === 200) {
			setBookingSearchResult(
				(data as IBookingSearchResponse).bookings.map(
					(item: IBookingSearchResult) => {
						return {
							key: item.id,
							...item,
						};
					}
				)
			);
		} else {
			message.error((data as string) || "系统繁忙，请稍后再试");
		}
	};

	const [form] = useForm();

	useEffect(() => {
		searchBooking({
			username: form.getFieldValue("username"),
			meetingRoomName: form.getFieldValue("meetingRoomName"),
			meetingRoomPosition: form.getFieldValue("meetingRoomPosition"),
			rangeStartDate: form.getFieldValue("rangeStartDate"),
			rangeStartTime: form.getFieldValue("rangeStartTime"),
			rangeEndDate: form.getFieldValue("rangeEndDate"),
			rangeEndTime: form.getFieldValue("rangeEndTime"),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageNo, pageSize, num]);

	const changePage = function (pageNo: number, pageSize: number) {
		setPageNo(pageNo);
		setPageSize(pageSize);
	};

	async function changeStatus(
		id: number,
		status: "apply" | "reject" | "unbind"
	) {
		const methods = {
			apply,
			reject,
			unbind,
		};
		const res = await methods[status](id);

		if (res.code === 201 || res.code === 200) {
			message.success("状态更新成功");
			setNum(Math.random());
		} else {
			message.error(res.data);
		}
	}

	return (
		<div id="bookingManage-container">
			<div className="bookingManage-form">
				<Form
					form={form}
					onFinish={searchBooking}
					name="search"
					layout="inline"
					colon={false}
				>
					<Form.Item label="预定人" name="username">
						<Input />
					</Form.Item>

					<Form.Item label="会议室名称" name="meetingRoomName">
						<Input />
					</Form.Item>

					<Form.Item label="预定开始日期" name="rangeStartDate">
						<DatePicker />
					</Form.Item>

					<Form.Item label="预定开始时间" name="rangeStartTime">
						<TimePicker />
					</Form.Item>

					<Form.Item label="预定结束日期" name="rangeEndDate">
						<DatePicker />
					</Form.Item>

					<Form.Item label="预定结束时间" name="rangeEndTime">
						<TimePicker />
					</Form.Item>

					<Form.Item label="位置" name="meetingRoomPosition">
						<Input />
					</Form.Item>

					<Form.Item label=" ">
						<Button type="primary" htmlType="submit">
							搜索预定申请
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className="bookingManage-table">
				<Table
					columns={columns}
					dataSource={bookingSearchResult}
					pagination={{
						current: pageNo,
						pageSize: pageSize,
						onChange: changePage,
					}}
				/>
			</div>
		</div>
	);
}
