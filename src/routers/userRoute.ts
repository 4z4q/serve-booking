import express from "express";
import { getUser, login, register } from "../services/userServices";

export const userRouter = express.Router();

userRouter.post("/register", async (request, response) => {
  try {
    const { firstName, lastName, email, password } = request.body;

    const { statusCode, token } = await register({
      firstName,
      lastName,
      email,
      password,
    });

    response.status(statusCode).json(token);
  } catch {
    response.status(500).send("Something went wrong!");
  }
});

userRouter.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const {
      token,
      statusCode,
      data,
      data: { message },
    } = await login({ email, password });

    response.status(statusCode).json({ token, ...data, message });
  } catch {
    response.status(500).send("Something went wrong!");
  }
});

userRouter.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const user = await getUser(id);

    response.status(200).json(user);
  } catch {
    response.status(500).send("Something went wrong!");
  }
});
