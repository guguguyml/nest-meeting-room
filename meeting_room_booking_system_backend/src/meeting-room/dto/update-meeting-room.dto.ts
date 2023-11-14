import { PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './create-meeting-room.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
    @IsNotEmpty({
        message: 'id 不能为空',
    })
    @ApiProperty()
    id: number;
}
