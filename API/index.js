import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to db!!");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`);
});
