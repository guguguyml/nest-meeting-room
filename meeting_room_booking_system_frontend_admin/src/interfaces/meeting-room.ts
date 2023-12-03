import { IUserInfo } from "./users";

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
	meetingRooms: IMeetingRoomSearchResult[];
	totalCount: number;
}

export interface IEditMeetingRoom {
	id?: number;
	name: string;
	capacity: number;
	location: string;
	equipment: string;
	description: string;
}

export interface IBookingSearchResult {
	id: number;
	startTime: string;
	endTime: string;
	status: string;
	note: string;
	createTime: string;
	updateTime: string;
	user: IUserInfo;
	room: IMeetingRoomSearchResult;
}

export interface ISearchBooking {
	username: string;
	meetingRoomName: string;
	meetingRoomPosition: string;
	rangeStartDate: Date;
	rangeStartTime: Date;
	rangeEndDate: Date;
	rangeEndTime: Date;
}

export interface IBookingSearchResponse {
	bookings: IBookingSearchResult[];
	totalCount: number;
}

export interface IUserBookingCount {
	userId: string;
	username: string;
	bookingCount: string;
}
export interface IMeetingRoomUsedCount {
	meetingRoomId: string;
	meetingRoomName: string;
	usedCount: string;
}
