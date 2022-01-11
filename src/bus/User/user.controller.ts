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
} from '@nestjs/common';

// Entities
import { User } from './user.entity';

// Services
import { UserService } from './user.service';

// Instruments
import { UserLoginInput, UserRegisterInput } from './user.inputs';

@Controller('users')
export class UserController {
    // eslint-disable-next-line max-params
    constructor(
        private readonly userService: UserService,
    ) {}

    // ================================================================================================================

    @Get('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: UserLoginInput): Promise<User | null> {
        const user = await this.userService.findOneByCredentials(body);

        if (!user) {
            throw new BadRequestException('Invalid credentials.');
        }

        return user;
    }

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: UserRegisterInput): Promise<User> {
        return await this.userService.createOne(body);
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
