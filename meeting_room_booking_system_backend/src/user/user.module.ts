import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permissions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, Permission])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
