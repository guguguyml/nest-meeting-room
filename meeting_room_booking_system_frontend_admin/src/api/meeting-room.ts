import request from "@/utils/axios";
import {
	IMeetingRoomSearchResponse,
	IEditMeetingRoom,
	IMeetingRoomSearchResult,
	ISearchBooking,
	IBookingSearchResponse,
	IUserBookingCount,
	IMeetingRoomUsedCount,
} from "@/interfaces/meeting-room";
import dayjs from "dayjs";

/**
 * 获取会议室列表
 */
export const meetingRoomList = (
	name: string,
	capacity: number,
	equipment: string,
	pageNo: number,
	pageSize: number
) =>
	request.get<IMeetingRoomSearchResponse | string>("/meeting-room/list", {
		params: {
			name,
			capacity,
			equipment,
			pageNo,
			pageSize,
		},
	});

/**
 * 删除会议室
 */
export const deleteMeetingRoom = (id: number) =>
	request.delete<string>("/meeting-room/" + id);

/**
 * 添加会议室
 */
export const createMeetingRoom = (meetingRoom: IEditMeetingRoom) =>
	request.post<string>("/meeting-room/create", meetingRoom);
/**
 * 更新会议室
 */
export const updateMeetingRoom = (meetingRoom: IEditMeetingRoom) =>
	request.put<string>("/meeting-room/update", meetingRoom);

/**
 * 根据id查询会议室信息
 */
export async function findMeetingRoom(id: number) {
	return await request.get<IMeetingRoomSearchResult | string>(
		"/meeting-room/" + id
	);
}

/**
 * 管理预订会议室列表
 */
export const bookingList = (
	searchBooking: ISearchBooking,
	pageNo: number,
	pageSize: number
) => {
	let bookingTimeRangeStart;
	let bookingTimeRangeEnd;

	if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
		const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format(
			"YYYY-MM-DD"
		);
		const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format(
			"HH:mm"
		);
		bookingTimeRangeStart = dayjs(
			rangeStartDateStr + " " + rangeStartTimeStr
		).valueOf();
	}

	if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
		const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format(
			"YYYY-MM-DD"
		);
		const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format(
			"HH:mm"
		);
		bookingTimeRangeEnd = dayjs(
			rangeEndDateStr + " " + rangeEndTimeStr
		).valueOf();
	}

	return request.get<IBookingSearchResponse | string>("/booking/list", {
		params: {
			username: searchBooking.username,
			meetingRoomName: searchBooking.meetingRoomName,
			meetingRoomPosition: searchBooking.meetingRoomPosition,
			bookingTimeRangeStart,
			bookingTimeRangeEnd,
			pageNo: pageNo,
			pageSize: pageSize,
		},
	});
};

/**
 * 通过
 */
export async function apply(id: number) {
	return await request.get<string>("/booking/apply/" + id);
}

/**
 * 驳回
 */
export async function reject(id: number) {
	return await request.get<string>("/booking/reject/" + id);
}
/**
 * 解除预订
 */
export async function unbind(id: number) {
	return await request.get<string>("/booking/unbind/" + id);
}

/**
 * 获取统计数据
 */
export async function meetingRoomUsedCount(startTime: string, endTime: string) {
	return await request.get<IMeetingRoomUsedCount[] | string>(
		"/statistic/meetingRoomUsedCount",
		{
			params: {
				startTime,
				endTime,
			},
		}
	);
}

export async function userBookingCount(startTime: string, endTime: string) {
	return await request.get<IUserBookingCount[] | string>(
		"/statistic/userBookingCount",
		{
			params: {
				startTime,
				endTime,
			},
		}
	);
}
