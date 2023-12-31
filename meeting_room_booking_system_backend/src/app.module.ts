import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permissions.entity';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { WenjieModule } from './wenjie/wenjie.module';
import { Order } from './wenjie/entities/wenjie.entity';
import { SubOrder } from './wenjie/entities/wenjie.orders.entity';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';
import { StatisticModule } from './statistic/statistic.module';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'src/.env',
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory(configService: ConfigService) {
                return {
                    secret: configService.get('jwt_secret'),
                    signOptions: {
                        expiresIn: '30m', // 默认 30 分钟
                    },
                };
            },
            inject: [ConfigService],
        }),

        TypeOrmModule.forRootAsync({
            useFactory(configService: ConfigService) {
                return {
                    type: 'mysql',
                    host: configService.get('mysql_server_host'),
                    port: configService.get('mysql_server_port'),
                    username: configService.get('mysql_server_username'),
                    password: configService.get('mysql_server_password'),
                    database: configService.get('mysql_server_database'),
                    synchronize: true,
                    timezone: '+08:00', // 设置时区
                    logging: false,
                    entities: [
                        User,
                        Role,
                        Permission,
                        Order,
                        SubOrder,
                        MeetingRoom,
                        Booking,
                    ],
                    poolSize: 10,
                    connectorPackage: 'mysql2',
                    extra: {
                        authPlugin: 'sha256_password',
                    },
                };
            },
            inject: [ConfigService],
        }),
        RedisModule,
        EmailModule,
        WenjieModule,
        MeetingRoomModule,
        BookingModule,
        StatisticModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: LoginGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
    ],
})
export class AppModule {}
