
// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import UniqueValidator from 'mongoose-unique-validator';

@Schema({
    versionKey: false,
})
export class User {
    @Prop({ required: true, unique: true})
    login: string;

    @Prop({ required: true })
    password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User).plugin(UniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
