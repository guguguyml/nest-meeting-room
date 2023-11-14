import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Put,
    Param,
    Delete,
    Query,
    DefaultValuePipe,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { generateParseIntPipe } from 'src/utils/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomVo } from './vo/meeting-room.vo';
import { MeetingRoomListVo } from './vo/meeting-room-list.vo';

@ApiTags('会议室管理')
@Controller('meeting-room')
export class MeetingRoomController {
    constructor(private readonly meetingRoomService: MeetingRoomService) {}

    /**
     * 创建会议室
     */
    @Post('create')
    @ApiBearerAuth()
    @ApiBody({
        type: CreateMeetingRoomDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '会议室名字已存在',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: MeetingRoomVo,
    })
    async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
        return await this.meetingRoomService.create(meetingRoomDto);
    }

    /**
     * 获取会议室列表
     */
    @ApiBearerAuth()
    @ApiQuery({
        name: 'pageNo',
        type: Number,
        required: false,
    })
    @ApiQuery({
        name: 'pageSize',
        type: Number,
        required: false,
    })
    @ApiQuery({
        name: 'name',
        type: String,
        required: false,
    })
    @ApiQuery({
        name: 'capacity',
        type: String,
        required: false,
    })
    @ApiQuery({
        name: 'equipment',
        type: String,
        required: false,
    })
    @ApiResponse({
        type: MeetingRoomListVo,
    })
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
            new DefaultValuePipe(2),
            generateParseIntPipe('pageSize'),
        )
        pageSize: number,
        @Query('name') name: string,
        @Query('capacity') capacity: number,
        @Query('equipment') equipment: string,
    ) {
        return await this.meetingRoomService.find(
            pageNo,
            pageSize,
            name,
            capacity,
            equipment,
        );
    }

    /**
     * 根据 id 查询会议室信息
     */
    @Get(':id')
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
        type: MeetingRoomVo,
    })
    async find(@Param('id') id: number) {
        return await this.meetingRoomService.findById(id);
    }

    /**
     * 修改会议室信息
     */
    @Put('update')
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateMeetingRoomDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '会议室不存在',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
    })
    async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
        return await this.meetingRoomService.update(meetingRoomDto);
    }

    /**
     * 删除会议室
     */
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
    })
    @Delete(':id')
    @ApiBearerAuth()
    @RequireLogin()
    async delete(@Param('id') id: number) {
        return await this.meetingRoomService.delete(id);
    }
}
