"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPayload = void 0;
const userPayload = (user) => ({
    _id: user._id + '',
    name: {
        first: user.name.first
    },
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar
});
exports.userPayload = userPayload;
