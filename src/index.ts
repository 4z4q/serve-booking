import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routers/userRoute";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("✅ Connected Successfully"))
  .catch((err) => {
    console.error(`❌ Error Connecting: ${err}`);
  });

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`);
});
