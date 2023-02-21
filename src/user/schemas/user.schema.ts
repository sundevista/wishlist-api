import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {userEmail, userUsername} from "../../constants/regexp";

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({required: true, unique: true, minLength: 5, maxlength: 25, validate: userUsername})
  username: string;

  @Prop({required: true, unique: true, minlength: 5, maxlength: 30, validate: userEmail})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true, minlength: 7, maxlength: 30})
  full_name: string;

  @Prop({minlength: 4, maxlength: 20, default: null})
  city: string;

  @Prop({minlength: 5, maxlength: 50, default: null})
  address: string;

  @Prop({min: 1, max: 10, default: 1})
  level: number;

  @Prop({min: 0, max: 100000, default: 0})
  xp: number;

  @Prop({minlength: 0, maxlength: 1000, default: []})
  wishes: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
