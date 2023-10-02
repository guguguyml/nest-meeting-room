import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
    ApiTags,
    ApiQuery,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { generateParseIntPipe } from 'src/utils/common';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDetailVo } from './vo/user-info.vo';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Inject(EmailService)
    private emailService: EmailService;
    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(JwtService)
    private jwtService: JwtService;

    @Inject(ConfigService)
    private configService: ConfigService;

    @Get('init-data')
    async initData() {
        await this.userService.initData();
        return 'done';
    }

    /**
     * 获取用户信息
     */
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'success',
        type: UserDetailVo,
    })
    @Get('info')
    @RequireLogin()
    async info(@UserInfo('userId') userId: number) {
        const user = await this.userService.findUserDetailById(userId);

        const vo = new UserDetailVo();
        vo.id = user.id;
        vo.email = user.email;
        vo.username = user.username;
        vo.headPic = user.headPic;
        vo.phoneNumber = user.phoneNumber;
        vo.nickName = user.nickName;
        vo.createTime = user.createTime;
        vo.isFrozen = user.isFrozen;

        return vo;
    }

    /**
     * 获取用户列表
     */
    @ApiBearerAuth()
    @ApiQuery({
        name: 'pageNo',
        description: '第几页',
        type: Number,
    })
    @ApiQuery({
        name: 'pageSize',
        description: '每页多少条',
        type: Number,
    })
    @ApiQuery({
        name: 'username',
        description: '用户名',
        type: String,
    })
    @ApiQuery({
        name: 'nickName',
        description: '昵称',
        type: String,
    })
    @ApiQuery({
        name: 'email',
        description: '邮箱地址',
        type: String,
    })
    @ApiResponse({
        type: UserListVo,
        description: '用户列表',
    })
    @RequireLogin()
    @Get('list')
    async list(
        @Query(
            'pageNo',
            new DefaultValuePipe(1),
            generateParseIntPipe('pageNo'),
        )
        pageNo: number,
        @Query(
            'pageSize',
            new DefaultValuePipe(2),
            generateParseIntPipe('pageSize'),
        )
        pageSize: number,
        @Query('username') username: string,
        @Query('nickName') nickName: string,
        @Query('email') email: string,
    ) {
        return await this.userService.findUsers(
            username,
            nickName,
            email,
            pageNo,
            pageSize,
        );
    }

    /**
     * 用户注册
     */
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '注册成功/失败',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '验证码已失效/验证码不正确/用户已存在',
        type: String,
    })
    @Post('register')
    async register(@Body() registerUser: RegisterUserDto) {
        return await this.userService.register(registerUser);
    }

    /**
     * 获取注册邮箱验证码
     */
    @ApiQuery({
        name: 'address',
        type: String,
        description: '邮箱地址',
        required: true,
        example: 'xxx@xx.com',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '发送成功',
        type: String,
    })
    @Get('register/captcha')
    async captcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(`captcha_${address}`, code, 5 * 60);

        await this.emailService.sendMail({
            to: address,
            subject: '注册验证码',
            html: `<p>你的注册验证码是 ${code}</p>`,
        });
        return '发送成功';
    }

    /**
     * 普通用户登录
     */
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '用户信息和Token',
        type: LoginUserVo,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String,
    })
    @Post('login')
    async userLogin(@Body() loginUser: LoginUserDto) {
        const vo = await this.userService.login(loginUser, false);

        vo.accessToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
                username: vo.userInfo.username,
                roles: vo.userInfo.roles,
                permissions: vo.userInfo.permissions,
            },
            {
                expiresIn:
                    this.configService.get('jwt_access_token_expires_time') ||
                    '30m',
            },
        );

        vo.refreshToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
            },
            {
                expiresIn:
                    this.configService.get('jwt_refresh_token_expires_time') ||
                    '7d',
            },
        );

        return vo;
    }

    /**
     * 管理员登录
     */
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '用户信息和Token',
        type: LoginUserVo,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String,
    })
    @Post('admin/login')
    async adminLogin(@Body() loginUser: LoginUserDto) {
        const vo = await this.userService.login(loginUser, true);
        vo.accessToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
                username: vo.userInfo.username,
                roles: vo.userInfo.roles,
                permissions: vo.userInfo.permissions,
            },
            {
                expiresIn:
                    this.configService.get('jwt_access_token_expires_time') ||
                    '30m',
            },
        );

        vo.refreshToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
            },
            {
                expiresIn:
                    this.configService.get('jwt_refresh_token_expires_time') ||
                    '7d',
            },
        );

        return vo;
    }

    /**
     * 刷新token / jwt验证的是 refreshToken
     */
    @ApiQuery({
        name: 'refreshToken',
        type: String,
        description: '刷新 token',
        required: true,
        example: 'xxxxxxxxyyyyyyyyzzzzz',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'token 已失效，请重新登录',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '刷新成功',
        type: RefreshTokenVo,
    })
    @Get('refresh/token')
    async refreshToken(@Query('refreshToken') refreshToken: string) {
        try {
            const data = this.jwtService.verify(refreshToken);

            const user = await this.userService.findUserById(
                data.userId,
                false,
            );

            const access_token = this.jwtService.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roles: user.roles,
                    permissions: user.permissions,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_access_token_expires_time',
                        ) || '30m',
                },
            );

            const refresh_token = this.jwtService.sign(
                {
                    userId: user.id,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_refresh_token_expires_time',
                        ) || '7d',
                },
            );
            const vo = new RefreshTokenVo();

            vo.access_token = access_token;
            vo.refresh_token = refresh_token;

            return vo;
        } catch (e) {
            throw new UnauthorizedException('token 已失效，请重新登录');
        }
    }

    /**
     * 刷新管理员token / jwt验证的是 refreshToken
     */
    @ApiQuery({
        name: 'refreshToken',
        type: String,
        description: '刷新 token',
        required: true,
        example: 'xxxxxxxxyyyyyyyyzzzzz',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'token 已失效，请重新登录',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '刷新成功',
        type: RefreshTokenVo,
    })
    @Get('admin/refresh/token')
    async adminRefreshToken(@Query('refreshToken') refreshToken: string) {
        try {
            const data = this.jwtService.verify(refreshToken);

            const user = await this.userService.findUserById(data.userId, true);

            const access_token = this.jwtService.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roles: user.roles,
                    permissions: user.permissions,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_access_token_expires_time',
                        ) || '30m',
                },
            );

            const refresh_token = this.jwtService.sign(
                {
                    userId: user.id,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_refresh_token_expires_time',
                        ) || '7d',
                },
            );

            const vo = new RefreshTokenVo();

            vo.access_token = access_token;
            vo.refresh_token = refresh_token;
        } catch (e) {
            throw new UnauthorizedException('token 已失效，请重新登录');
        }
    }

    /**
     * 更新密码
     */
    @ApiBody({
        type: UpdateUserPasswordDto,
    })
    @ApiResponse({
        type: String,
        description: '验证码已失效/不正确',
    })
    @Post(['update/password', 'admin/update/password'])
    async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
        return await this.userService.updatePassword(passwordDto);
    }

    /**
     * 获取邮箱验证码
     */
    @ApiQuery({
        type: String,
        name: 'address',
        description: '邮箱地址',
    })
    @ApiResponse({
        type: String,
        description: '发送成功',
    })
    @Get('update/password/captcha')
    async updatePasswordCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_password_captcha_${address}`,
            code,
            10 * 60,
        );

        await this.emailService.sendMail({
            to: address,
            subject: '更改密码验证码',
            html: `<p>你的更改密码验证码是 ${code}</p>`,
        });
        return '发送成功';
    }

    /**
     * 更新个人信息
     */
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        type: LoginUserVo,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '验证码已失效/不正确',
        type: String,
    })
    @RequireLogin()
    @Post(['update', 'admin/update'])
    @RequireLogin()
    async update(
        @UserInfo('userId') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.update(userId, updateUserDto);
    }

    /**
     * 获取更新信息邮箱验证码
     */
    @ApiBearerAuth()
    @ApiQuery({
        type: String,
        name: 'address',
        description: '邮箱地址',
    })
    @ApiResponse({
        type: String,
        description: '发送成功',
    })
    @RequireLogin()
    @Get('update/captcha')
    async updateCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_user_captcha_${address}`,
            code,
            10 * 60,
        );

        await this.emailService.sendMail({
            to: address,
            subject: '更改用户信息验证码',
            html: `<p>你的验证码是 ${code}</p>`,
        });
        return '发送成功';
    }

    /**
     * 冻结用户不可以预定会议室
     */
    @ApiBearerAuth()
    @ApiQuery({
        name: 'id',
        description: 'userId',
        type: Number,
    })
    @ApiResponse({
        type: String,
        description: 'success',
    })
    @RequireLogin()
    @Get('freeze')
    async freeze(@Query('id') userId: number) {
        await this.userService.freezeUserById(userId);
        return 'success';
    }
}