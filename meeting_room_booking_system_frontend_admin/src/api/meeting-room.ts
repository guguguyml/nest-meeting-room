import request from "@/utils/axios";
import {
	IMeetingRoomSearchResponse,
	IEditMeetingRoom,
	IMeetingRoomSearchResult,
} from "@/interfaces/meeting-room";

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
