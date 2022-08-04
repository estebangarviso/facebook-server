import connect from '../db';
import { User } from './../models';

connect();

User.find({})
  .then((users) => {
    console.log(users);
  })
  .catch((err) => {
    console.log(err);
  });
