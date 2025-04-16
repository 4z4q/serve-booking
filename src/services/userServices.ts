import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateUserUpdate } from "../model/userModel";

interface RegeisterParms {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

const SALT = 10;

const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || ""); // Json web Token => Create Key And Encrypt Data
};

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegeisterParms) => {
  // check if user already exists in db
  try {
    const { error } = validateUserUpdate({
      firstName,
      lastName,
      email,
      password,
    });
    if (error) {
      return { data: { message: error.message }, statusCode: 400 };
    }

    const findUser = await userModel.findOne({ email });

    if (findUser)
      return { data: { message: "User already exists" }, statusCode: 400 };

    const hashPassword = await bcrypt.hash(password, SALT);

    const newUser = await new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    // save => add to db
    newUser.save();

    // the token will be sent back to the user
    const token = generateJWT({ firstName, lastName, email });

    return {
      data: {
        user: {
          firstName,
          lastName,
          email,
        },
      },
      token,
      statusCode: 200,
    };
  } catch (error) {
    return { data: { message: "Something went wrong" }, statusCode: 500 };
  }
};

export const login = async ({ email, password }: LoginParams) => {
  try {
    const findUser = await userModel.findOne({ email });

    if (!findUser)
      return { data: { message: "User not found" }, statusCode: 400 };

    const checkPassword = await bcrypt.compare(password, findUser.password);

    if (!checkPassword) {
      return {
        data: { message: "Invalid email or password" },
        statusCode: 401,
      };
    }

    const token = generateJWT({
      id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
    });

    if (token && checkPassword) {
      return {
        data: {
          user: {
            id: findUser._id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
          },
        },
        token,
        statusCode: 200,
      };
    }

    return { data: { message: "User already exists" }, statusCode: 400 };

    
  } catch (error) {
    return { data: { message: "Something went wrong" }, statusCode: 500 };
  }
};

export const getUser = async (id: string) => {
  const user = await userModel.findById(id);
  return user;
};

