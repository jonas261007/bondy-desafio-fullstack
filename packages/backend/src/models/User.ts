import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  company?: string;
  password?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String },
  password: { type: String },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
