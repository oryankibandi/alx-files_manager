import { Schema, model, connect } from 'mongoose';
import { IUser } from 'utils/validators/base.validator';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
