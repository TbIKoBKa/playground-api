// Core
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Instruments
import { User, UserDocument } from './user.entity';
import { UserLoginInput, UserRegisterInput } from './user.inputs';

const decodePassword = (password: string): string => Buffer.from(password).toString('base64');

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) { }

    // ================================================================================================================

    async createOne({ login, password }: UserRegisterInput): Promise<User> {
        const newUser = new this.userModel({ login, password: decodePassword(password) });

        return await newUser.save();
    }

    // ================================================================================================================

    async findAll(): Promise<User[]> {
        return await this.userModel.find();
    }

    // ================================================================================================================

    async findById(userId: string): Promise<User | null> {
        const user = await this.userModel.findById(userId);

        return user;
    }

    // ================================================================================================================

    async findOneByCredentials({ login, password }: UserLoginInput): Promise<User | null> {
        const user = await this.userModel.findOne({ login, password: decodePassword(password) });

        return user;
    }

    // ================================================================================================================

    async deleteOne(userId: string): Promise<boolean> {
        try {
            await this.userModel.findByIdAndDelete(userId);

            return true;
        } catch (error) {
            return false;
        }
    }

    // ================================================================================================================

    async dropCollection(): Promise<boolean> {
        try {
            await this.userModel.collection.drop();

            return true;
        } catch (error) {
            return false;
        }
    }
}
