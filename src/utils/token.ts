import { JwtPayload } from 'jsonwebtoken';
export const userPayload = (user: JwtPayload['user']) => ({
  _id: user._id + '',
  name: {
    first: user.name.first
  },
  fullname: user.fullname,
  email: user.email,
  avatar: user.avatar
});
