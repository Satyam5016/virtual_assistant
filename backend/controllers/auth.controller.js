import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../models/token.js";   // ✅ import here

// signup
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = genToken(user._id);   // ✅ no await needed
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,   // set true in production (with HTTPS)
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Sign up error: ${error.message}` });
  }
};

// login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(user._id);   // ✅ fixed
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// logout
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};
