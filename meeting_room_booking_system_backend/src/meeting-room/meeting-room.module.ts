import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { MeetingRoom } from './entities/meeting-room.entity';

@Module({
    controllers: [MeetingRoomController],
    imports: [TypeOrmModule.forFeature([MeetingRoom])],
    providers: [MeetingRoomService],
})
export class MeetingRoomModule {}
