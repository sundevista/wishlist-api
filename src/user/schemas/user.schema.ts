import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  full_name: string;

  @Prop({ default: null })
  city: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: [] })
  wishes: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
