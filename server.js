import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import permissionRouter from "./routes/permission.js";
import authRouter from "./routes/auth.js";
import roleRouter from "./routes/role.js";
import brandRouter from "./routes/brand.js";
import tagRouter from "./routes/tag.js";
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";
import { errorHandler } from "./middlewares/errorhandler.js";
import { mongoBDConnect } from "./config/db.js";

// initialization
const app = express();
dotenv.config();

// set middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin : `http://localhost:3000`,
  credentials : true,
}));
app.use(cookieParser());

// set environment vars
const PORT = process.env.PORT || 9090;

// routing
app.use("/api/v1/user", userRouter);
app.use("/api/v1/permission", permissionRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

// static
app.use(express.static("public"));

// use error handler
app.use(errorHandler);

// app listen
app.listen(PORT, () => {
  mongoBDConnect();
  console.log(`server is running on port ${PORT}`.bgGreen.black);
});
