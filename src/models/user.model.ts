import { Schema, model } from 'mongoose';
import UserMethods, { preSaveUser } from './methods/user.method';
import UserValidation from './validations/user.validation';
import type { IUser } from './user.model.d';

export const UserSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (avatar: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.avatar(avatar);
        },
        message: 'File extension not allowed (only png, jpg, jpeg, gif)'
      }
    },
    name: {
      first: {
        type: String,
        required: true,
        validate: {
          validator: (firstName: string) => {
            // @ts-ignore
            if (UserSchema.methods.skipValidation()) return true;
            return UserValidation.name(firstName);
          },
          message: 'First name must be at least 2 characters long'
        },
        trim: true
      },
      last: {
        type: String,
        required: true,
        validate: {
          validator: (lastName: string) => {
            // @ts-ignore
            if (UserSchema.methods.skipValidation()) return true;
            return UserValidation.name(lastName);
          },
          message: 'Last name must be at least 2 characters long'
        },
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.email(email);
        },
        message: 'Email is not valid'
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (password: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.password(password);
        },
        message:
          'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character (@$!%*?&)'
      }
    }
  },
  {
    timestamps: true,
    methods: UserMethods
  }
);

/**
 * Virtuals
 */
UserSchema.virtual('fullname').get(function () {
  return `${this.name.first} ${this.name.last}`;
});

UserSchema.pre('save', preSaveUser);

/**
 * Validations
 */

export const User = model('User', UserSchema);
