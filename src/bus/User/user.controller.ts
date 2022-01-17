// Core
import {
    Controller,
    Get,
    Post,
    Delete,
    HttpCode,
    HttpStatus,
    Body,
    BadRequestException,
    Param,
    Query,
    Res
} from '@nestjs/common';

// Entities
import { User } from './user.entity';

// Services
import { UserService } from './user.service';

// Instruments
import { UserRegisterInput } from './user.inputs';

// Types
import { Response } from 'express'

@Controller('users')
export class UserController {
    // eslint-disable-next-line max-params
    constructor(
        private readonly userService: UserService,
    ) {}

    // ================================================================================================================
    
    @Get('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Query('login') login: string, @Query('password') password: string, @Res() response: Response) {
        const user = await this.userService.findOneByCredentials({ login, password });

        if (!user) {
            throw new BadRequestException('Invalid credentials.');
        }

        response.cookie('logged', true, { maxAge: 86400000 })
        response.send({ id: user._id, login: user.login })
    }

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: UserRegisterInput, @Res() response: Response) {
        const user = await this.userService.createOne(body);

        response.cookie('logged', true, { maxAge: 86400000 })
        response.send({ id: user._id, login: user.login })
    }

    // ================================================================================================================

    @Get()
    @HttpCode(HttpStatus.OK)
    async users(): Promise<User[]> {
        const users = await this.userService.findAll();

        return users.reverse();
    }

    @Get('/refresh/:userId')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Param('userId') userId: string, // eslint-disable-line @typescript-eslint/indent
    ): Promise<User> {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new BadRequestException('User does not exist');
        }

        return user;
    }

    // ================================================================================================================

    @Delete('/drop')
    @HttpCode(HttpStatus.OK)
    async dropUsersCollection(): Promise<Boolean> {
        const result = await this.userService.dropCollection();

        if (!result) {
            throw new BadRequestException('drop user collection failed');
        }

        return true;
    }

    // ================================================================================================================

    @Delete('/:userId')
    @HttpCode(HttpStatus.OK)
    async deleteUser(
        @Param('userId') userId: string,
    ): Promise<Boolean> {
        return await this.userService.deleteOne(userId);
    }
}
