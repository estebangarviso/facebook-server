import MongoConnect from "../db";
import { User } from "./../models";

MongoConnect();

User.find({})
  .then((users) => {
    console.log(users);
  })
  .catch((err) => {
    console.log(err);
  });
