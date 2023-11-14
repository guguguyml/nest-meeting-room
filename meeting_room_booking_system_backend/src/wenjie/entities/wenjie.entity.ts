import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SubOrder } from './wenjie.orders.entity';

@Entity({
    name: 'order',
})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: null,
    })
    account: string;

    @Column({
        name: 'seller_nick',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    sellerNick: string;

    @Column({
        name: 'open_uid',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    openUid: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    tid: string;

    @Column({
        name: 'pay_time',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    payTime: string;

    @Column({
        nullable: true, //是否为空
        default: 0,
    })
    payment: number;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    status: string;

    @Column({
        name: 'status_description',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    statusDescription: string;

    @Column({
        name: 'receiver_address',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    receiverAddress: string;

    @Column({
        name: 'receiver_city',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    receiverCity: string;

    @Column({
        name: 'receiver_district',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    receiverDistrict: string;

    @Column({
        name: 'receiver_name',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    receiverName: string;

    @Column({
        name: 'receiver_state',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    receiverState: string;

    @Column({
        name: 'receiver_mobile',
        length: 20,
        nullable: true, //是否为空
        default: '',
    })
    receiverMobile: string;

    @Column({
        name: 'trade_from',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    tradeFrom: string;

    @Column({
        name: 'trade_source',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    tradeSource: string;

    @Column({
        name: 'type',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    type: string;

    @Column({
        name: 'update_time',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    updateTime: string;

    @Column({
        name: 'shop_type_name',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    shopTypeName: string;

    @Column({
        name: 'shop_type',
        nullable: true, //是否为空
        default: 0,
    })
    shopType: number;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    created: string;

    @Column({
        name: 'start_time',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    startTime: string;
    @Column({
        name: 'end_time',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    endTime: string;

    @Column({
        name: 'logo_url',
        length: 500,
        nullable: true, //是否为空
        default: '',
    })
    logoUrl: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    platform: string;

    @Column({
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    title: string;

    @Column({
        name: 'buyer_nick',
        length: 200,
        nullable: true, //是否为空
        default: '',
    })
    buyerNick: string;

    @OneToMany(() => SubOrder, (subOrder) => subOrder.order, {
        cascade: true,
    })
    subOrders: SubOrder[];
}
