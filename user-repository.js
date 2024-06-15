import DBLocal from "db-local";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./config.js";

const { Schema } = new DBLocal({ path: "./db" });

const User = Schema("User", {
  _id: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
});
export class UserRepository {
  static async create({ username, password }) {
    Validation.username(username);
    Validation.password(password);
    const user = User.findOne({ username });
    if (user) {
      throw new Error("user already exists");
    }
    const id = crypto.randomUUID();
    User.create({
      _id: id,
      username,
      password: await bcrypt.hash(password, SALT_ROUNDS),
    }).save();

    return id;
  }

  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);
    const user = User.findOne({ username });

    if (!user) {
      throw new Error("user not found");
    }
    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("invalid credentials");
    }
    const { password: _, ...publicUser } = user;
    return publicUser;
  }
}

class Validation {
  static username(username) {
    if (typeof username !== "string") {
      throw new Error("username must be a string");
    }
    if (username.length < 3) {
      throw new Error("username must be at least 3 characters long");
    }
  }
  static password(password) {
    if (typeof password !== "string") {
      throw new Error("password must be a string");
    }
    if (password.length < 3) {
      throw new Error("password must be at least 3 characters long");
    }
  }
}
