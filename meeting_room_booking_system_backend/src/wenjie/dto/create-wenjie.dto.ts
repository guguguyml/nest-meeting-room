import { ApiProperty } from '@nestjs/swagger';
import { WenjieOrdersDto } from './wenjie.orders.dto';

export class CreateWenjieDto {
    @ApiProperty()
    account: string;
    @ApiProperty()
    sellerNick: string;
    @ApiProperty()
    openUid: string;
    @ApiProperty()
    tid: string;
    @ApiProperty()
    payTime: string;
    @ApiProperty()
    payment: number;
    @ApiProperty()
    status: string;
    @ApiProperty()
    statusDescription: string;
    @ApiProperty()
    receiverAddress: string;
    @ApiProperty()
    receiverCity: string;
    @ApiProperty()
    receiverDistrict: string;
    @ApiProperty()
    receiverName: string;
    @ApiProperty()
    receiverState: string;
    @ApiProperty()
    receiverMobile: string;
    @ApiProperty()
    tradeFrom: string;
    @ApiProperty()
    tradeSource: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    updateTime: string;
    @ApiProperty()
    shopTypeName: string;
    @ApiProperty()
    shopType: number;
    @ApiProperty()
    created: string;
    @ApiProperty()
    endTime: string;
    @ApiProperty()
    logoUrl: string;
    @ApiProperty()
    platform: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    buyerNick: string;
    @ApiProperty()
    subOrders: WenjieOrdersDto[];
}
