import request from "@/utils/axios";
import { IMeetingRoomSearchResponse } from "@/interfaces/meeting-room";

/**
 * 用户登录接口
 */
export const searchMeetingRoomList = (
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
