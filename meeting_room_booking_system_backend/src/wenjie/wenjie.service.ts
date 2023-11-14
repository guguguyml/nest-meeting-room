import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWenjieDto } from './dto/create-wenjie.dto';
import { WenjieDto } from './dto/update-wenjie.dto';
import { WenjieOrdersDto } from './dto/wenjie.orders.dto';
import { Order } from './entities/wenjie.entity';
import { SubOrder } from './entities/wenjie.orders.entity';

@Injectable()
export class WenjieService {
    private logger = new Logger();

    @InjectRepository(Order)
    private wenjieRepository: Repository<Order>;
    @InjectRepository(SubOrder)
    private wenjieOrderRepository: Repository<SubOrder>;

    async create(createWenjieDto: CreateWenjieDto) {
        try {
            const order = await this.wenjieRepository.findOne({
                where: {
                    tid: createWenjieDto.tid,
                },
            });
            if (order) return '已有重复数据';

            await this.wenjieRepository.save(createWenjieDto);
            // await this.wenjieOrderRepository.save([...subOrders]);
            return '添加成功';
        } catch (e) {
            this.logger.error(e, WenjieService);
            return '添加失败';
        }
    }

    findAll() {
        return `This action returns all wenjie`;
    }

    async findOne(id: number) {
        return await this.wenjieRepository.findOneBy({
            id: id,
        });
    }
}
