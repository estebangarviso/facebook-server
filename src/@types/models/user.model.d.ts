import { Document } from 'mongoose';

export interface IUser extends Document {
  avatar: string;
  name: {
    first: string;
    last: string;
  };
  fullname: string;
  email: string;
  password: string;
  skipValidation: () => boolean;
  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: boolean) => void) => void;
}
