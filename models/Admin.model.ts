import mongoose, { Document } from "mongoose";

export interface IAdmin extends Document {
  user: string;
  password: string;
  avatar: string;
  name: string;
}
const instance = new mongoose.Schema({
  user: String,
  password: String,
  avatar: String,
  name: String,
});

export default mongoose.model<IAdmin>("admin", instance);
