import { ApiProperty } from '@nestjs/swagger';
import { WenjieDto } from './update-wenjie.dto';

export class WenjieOrdersDto {
    @ApiProperty()
    tid: string;
    @ApiProperty()
    num: number;
    @ApiProperty()
    numIid: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    picPath: string;
    @ApiProperty()
    oid: string;
    @ApiProperty()
    payment: number;
    @ApiProperty()
    divideOrderFee: number;
    @ApiProperty()
    price: string;
    @ApiProperty()
    skuId: string;
    @ApiProperty()
    skuPropertiesName: string;
    @ApiProperty()
    updateTime: string;
    @ApiProperty()
    wenjie: WenjieDto;
}
