import { Injectable, Inject } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Like, Between, Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { MeetingRoom } from './../meeting-room/entities/meeting-room.entity';
import { User } from './../user/entities/user.entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
    @InjectEntityManager()
    private entityManager: EntityManager;

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(EmailService)
    private emailService: EmailService;

    async initData() {
        const user1 = await this.entityManager.findOneBy(User, {
            id: 1,
        });
        const user2 = await this.entityManager.findOneBy(User, {
            id: 2,
        });

        const room1 = await this.entityManager.findOneBy(MeetingRoom, {
            id: 3,
        });
        const room2 = await await this.entityManager.findOneBy(MeetingRoom, {
            id: 1,
        });

        const booking1 = new Booking();
        booking1.room = room1;
        booking1.user = user1;
        booking1.startTime = new Date();
        booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

        await this.entityManager.save(Booking, booking1);

        const booking2 = new Booking();
        booking2.room = room2;
        booking2.user = user2;
        booking2.startTime = new Date();
        booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

        await this.entityManager.save(Booking, booking2);

        const booking3 = new Booking();
        booking3.room = room1;
        booking3.user = user2;
        booking3.startTime = new Date();
        booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

        await this.entityManager.save(Booking, booking3);

        const booking4 = new Booking();
        booking4.room = room2;
        booking4.user = user1;
        booking4.startTime = new Date();
        booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

        await this.entityManager.save(Booking, booking4);
    }

    create(createBookingDto: CreateBookingDto) {
        return 'This action adds a new booking';
    }

    async find(
        pageNo: number,
        pageSize: number,
        username: string,
        meetingRoomName: string,
        meetingRoomPosition: string,
        bookingTimeRangeStart: number,
        bookingTimeRangeEnd: number,
    ) {
        const skipCount = (pageNo - 1) * pageSize;

        const condition: Record<string, any> = {};

        if (username) {
            condition.user = {
                username: Like(`%${username}%`),
            };
        }

        if (meetingRoomName) {
            condition.room = {
                name: Like(`%${meetingRoomName}%`),
            };
        }

        if (meetingRoomPosition) {
            if (!condition.room) {
                condition.room = {};
            }
            condition.room.location = Like(`%${meetingRoomPosition}%`);
        }

        if (bookingTimeRangeStart) {
            if (!bookingTimeRangeEnd) {
                bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
            }
            condition.startTime = Between(
                new Date(bookingTimeRangeStart),
                new Date(bookingTimeRangeEnd),
            );
        }

        const [bookings, totalCount] = await this.entityManager.findAndCount(
            Booking,
            {
                where: condition,
                relations: {
                    user: true,
                    room: true,
                },
                skip: skipCount,
                take: pageSize,
            },
        );

        return {
            bookings,
            totalCount,
        };
    }

    async apply(id: number) {
        await this.entityManager.update(
            Booking,
            {
                id,
            },
            {
                status: '审批通过',
            },
        );
        return 'success';
    }

    async reject(id: number) {
        await this.entityManager.update(
            Booking,
            {
                id,
            },
            {
                status: '审批驳回',
            },
        );
        return 'success';
    }

    async unbind(id: number) {
        await this.entityManager.update(
            Booking,
            {
                id,
            },
            {
                status: '已解除',
            },
        );
        return 'success';
    }

    async urge(id: number) {
        const flag = await this.redisService.get('urge_' + id);

        if (flag) {
            return '已经催办一次了，请耐心等待或者半小时后催办';
        }

        let email = await this.redisService.get('admin_email');

        if (!email) {
            const admin = await this.entityManager.findOne(User, {
                select: {
                    email: true,
                },
                where: {
                    isAdmin: true,
                },
            });

            email = admin.email;

            this.redisService.set('admin_email', admin.email);
        }

        this.emailService.sendMail({
            to: email,
            subject: '预定申请催办提醒',
            html: `id 为 ${id} 的预定申请正在等待审批`,
        });

        this.redisService.set('urge_' + id, 1, 60 * 30);
    }

    findAll() {
        return `This action returns all booking`;
    }

    findOne(id: number) {
        return `This action returns a #${id} booking`;
    }

    update(id: number, updateBookingDto: UpdateBookingDto) {
        return `This action updates a #${id} booking`;
    }

    remove(id: number) {
        return `This action removes a #${id} booking`;
    }
}
