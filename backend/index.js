import express from "express";
import dotenv from "dotenv";
import connedctDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// ✅ Setup CORS
app.use(
  cors({
    origin: "https://virtualassistant-oigr.onrender.com", // frontend
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);



app.listen(port, () => {
  connedctDb();
  console.log(`Server started on port ${port}`);
});
