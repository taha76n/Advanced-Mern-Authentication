import "dotenv/config";
console.log("CSRF SECRET:", process.env.CSRF_SECRET)
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("CSRF_SECRET type:", typeof process.env.CSRF_SECRET)
console.log("CSRF_SECRET length:", process.env.CSRF_SECRET?.length)
import express from "express";
import connectDb from "./config/mongodb.js";
import authRouter from "./routes/userAuth.routes.js";
import redisClient from "./config/redis.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(helmet());

//   By default, browsers block cookies, authorization headers, and TLS client certificates in cross-origin requests.Setting credentials: true in CORS tells the server “allow the browser to include cookies or authentication info (like JWT in cookies) in requests.”

const portNumber = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Working");
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Connected Successfully");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
connectRedis();
connectDb();


app.use("/api/v1", authRouter);

// catches any error thrown inside a route that wasn't caught by tryCatch
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// handle requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(portNumber, () => {
  console.log(`Server running on port ${portNumber}`);
});
