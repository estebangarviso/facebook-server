export default {};
import jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    user: {
      _id: string;
      name: {
        first: string;
        last: string;
      };
      fullname: string;
      email: string;
      avatar: string;
    };
  }
}
