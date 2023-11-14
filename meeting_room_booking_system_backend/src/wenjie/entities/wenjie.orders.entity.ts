import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Order } from './wenjie.entity';

@Entity({
    name: 'sub_order',
})
export class SubOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200,
        nullable: true, //是否为空 
        default: '',
    })
    tid: string;

    @Column({
        nullable: true, //是否为空
        default: 0,
    })
    num: number;

    @Column({
        name: 'num_tid',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    numTid: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    status: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    title: string;

    @Column({
        name: 'picPath',
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    picPath: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    oid: string;

    @Column({
        nullable: true, //是否为空
        default: 0,
    })
    payment: number;

    @Column({
        name: 'divide_order_fee',
        nullable: true, //是否为空
        default: 0,
    })
    divideOrderFee: number;

    @Column({
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    price: string;

    @Column({
        name: 'sku_id',
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    skuID: string;

    @Column({
        name: 'sku_properties_name',
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    skuPropertiesName: string;

    @Column({
        name: 'update_time',
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    updateTime: string;

    @ManyToOne(() => Order)
    order: Order;
}
