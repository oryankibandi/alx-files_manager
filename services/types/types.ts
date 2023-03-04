import { Schema, Types } from 'mongoose';

export interface IUserModel {
  _id?: Types.ObjectId;
  email: string;
  password: string;
}
