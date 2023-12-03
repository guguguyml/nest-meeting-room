import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    Patch,
    Param,
    DefaultValuePipe,
    Delete,
} from '@nestjs/common';
import {
    ApiTags,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { generateParseIntPipe } from 'src/utils/common';
import { RequireLogin } from 'src/custom.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('会议室预定')
@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.create(createBookingDto);
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Get('list')
    async list(
        @Query(
            'pageNo',
            new DefaultValuePipe(1),
            generateParseIntPipe('pageNo'),
        )
        pageNo: number,
        @Query(
            'pageSize',
            new DefaultValuePipe(10),
            generateParseIntPipe('pageSize'),
        )
        pageSize: number,
        @Query('username') username: string,
        @Query('meetingRoomName') meetingRoomName: string,
        @Query('meetingRoomPosition') meetingRoomPosition: string,
        @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
        @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number,
    ) {
        return this.bookingService.find(
            pageNo,
            pageSize,
            username,
            meetingRoomName,
            meetingRoomPosition,
            +bookingTimeRangeStart,
            +bookingTimeRangeEnd,
        );
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Get('apply/:id')
    async apply(@Param('id') id: number) {
        return this.bookingService.apply(id);
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Get('reject/:id')
    async reject(@Param('id') id: number) {
        return this.bookingService.reject(id);
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Get('unbind/:id')
    async unbind(@Param('id') id: number) {
        return this.bookingService.unbind(id);
    }

    @ApiBearerAuth()
    @RequireLogin()
    @Get('urge/:id')
    async urge(@Param('id') id: number) {
        return this.bookingService.urge(id);
    }
}
