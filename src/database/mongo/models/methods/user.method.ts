import { PreSaveMiddlewareFunction, HydratedDocument } from "mongoose";
import { SKIP_VALIDATION, SALT_WORK_FACTOR } from "~/config";
import bcrypt from "bcrypt";

const UserSchemaMethods: Record<
  any,
  (this: HydratedDocument<IUser>, ...args: any) => unknown
> = {
  skipValidation() {
    return SKIP_VALIDATION;
  },
  comparePassword(candidatePassword: string, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  },
};

export const preSaveUser: PreSaveMiddlewareFunction<HydratedDocument<IUser>> =
  function (next) {
    const user = this;

    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(SALT_WORK_FACTOR, function (saltError, salt) {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, function (hashError, hash) {
            if (hashError) {
              return next(hashError);
            }

            user.password = hash;
            next();
          });
        }
      });
    } else {
      return next();
    }
  };

export default UserSchemaMethods;
