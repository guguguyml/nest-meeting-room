import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WenjieService } from './wenjie.service';
import { WenjieController } from './wenjie.controller';
import { Order } from './entities/wenjie.entity';
import { SubOrder } from './entities/wenjie.orders.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, SubOrder])],
    controllers: [WenjieController],
    providers: [WenjieService],
})
export class WenjieModule {}
