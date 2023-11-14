export interface ISearchMeetingRoom {
	name: string;
	capacity: number;
	equipment: string;
}

export interface IMeetingRoomSearchResult {
	id: number;
	name: string;
	capacity: number;
	location: string;
	equipment: string;
	description: string;
	isBooked: boolean;
	createTime: Date;
	updateTime: Date;
}

export interface IMeetingRoomSearchResponse {
	totalCount: number;
	meetingRooms: IMeetingRoomSearchResult[];
}
