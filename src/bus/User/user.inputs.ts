// Core
import { IsString } from 'class-validator';

export class UserLoginInput {
    @IsString()
    login: string;

    @IsString()
    password: string;
}

export class UserRegisterInput {
    @IsString()
    login: string;

    @IsString()
    password: string;
}
