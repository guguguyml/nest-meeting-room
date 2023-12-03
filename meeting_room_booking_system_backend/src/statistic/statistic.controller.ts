import { Controller, Get, Inject, Query, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { StatisticService } from './statistic.service';
import { UserBookingCount } from './vo/UserBookingCount.vo';
import { MeetingRoomUsedCount } from './vo/MeetingRoomUsedCount.vo';

@ApiTags('会议室统计信息')
@Controller('statistic')
export class StatisticController {
    @Inject(StatisticService)
    private statisticService: StatisticService;

    @Get('userBookingCount')
    @ApiBearerAuth()
    @ApiQuery({
        name: 'startTime',
        type: String,
        description: '开始时间',
    })
    @ApiQuery({
        name: 'endTime',
        type: String,
        description: '结束时间',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserBookingCount,
    })
    async userBookingCount(
        @Query('startTime') startTime: string,
        @Query('endTime') endTime,
    ) {
        return this.statisticService.userBookingCount(startTime, endTime);
    }

    @ApiBearerAuth()
    @ApiQuery({
        name: 'startTime',
        type: String,
        description: '开始时间',
    })
    @ApiQuery({
        name: 'endTime',
        type: String,
        description: '结束时间',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: MeetingRoomUsedCount,
    })
    @Get('meetingRoomUsedCount')
    async meetingRoomUsedCount(
        @Query('startTime') startTime: string,
        @Query('endTime') endTime,
    ) {
        return this.statisticService.meetingRoomUsedCount(startTime, endTime);
    }
}
