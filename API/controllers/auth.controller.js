import User from "../models/user.modle.js";
import bcryptjs from "bcryptjs";
export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      message: "User created successfuly",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
