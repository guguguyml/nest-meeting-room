import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import {
    ApiTags,
    ApiQuery,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { WenjieService } from './wenjie.service';
import { CreateWenjieDto } from './dto/create-wenjie.dto';
// import { UpdateWenjieDto } from './dto/update-wenjie.dto';

@ApiTags('稳捷')
@Controller('wenjie')
export class WenjieController {
    constructor(private readonly wenjieService: WenjieService) {}

    @Post()
    create(@Body() createWenjieDto: CreateWenjieDto) {
        return this.wenjieService.create(createWenjieDto);
    }

    @Get()
    findAll() {
        return this.wenjieService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.wenjieService.findOne(+id);
    }
}
