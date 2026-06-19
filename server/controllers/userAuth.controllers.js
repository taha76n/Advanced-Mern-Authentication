import sanitize from "mongo-sanitize";
import TryCatch from "../middleware/tryCatch.js";
import { loginSchema, registerSchema } from "../config/zod.js";
import User from "../models/users.models.js";
import redisClient from "../config/redis.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/nodemailer.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../config/generateToken.js";
import { generateToken as generateCsrfToken } from "../config/csrf.js"

//Registration

export const register = TryCatch(async (req, res) => {
  // sanitize req.body
  const sanitizedBody = sanitize(req.body);

  // validated the sanitizedbody by making a register Schema via zod
  const validation = registerSchema.safeParse(sanitizedBody);

  //if validation is success then this

  // {
  //   success: true,
  //   data: /* typed and validated value */
  // }

  //if validation is unsuccessful then this

  // {
  //   success: false,
  //   error: /* ZodError object with details */
  // }

  // //Error handler function
  // if (!validation.success) {
  //   const zodError = validation.error;

  //   // const zodError = validation.error.issues;
  //   // console.log(zodError);

  //   let firstErrorMessage = "Validation Error";
  //   let allErrors = [];
  //   if (zodError.issues && Array.isArray(zodError.issues)) {
  //     allErrors = zodError.issues.map((issue)=>({
  //       field:issue.path ? issue.path.join(".") : "Unknown",
  //       message:issue.message || "Validation Error",
  //       code:issue.code
  //     }))
  //   };
  //   firstErrorMessage = allErrors[0]?.message || "validation Error";
  //   return res.status(400).json({message: firstErrorMessage, error: allErrors});
  // }

  //Simplified error handler

  if (!validation.success) {
    // Zod error object
    const zodError = validation.error;

    // Make a clean list of all errors
    const allErrors = zodError.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    // Pick the first error for a simple message
    const firstErrorMessage = allErrors[0].message;

    // Send response
    return res.status(400).json({
      message: firstErrorMessage, // simple error
      errors: allErrors, // detailed list
    });
  }

  const { name, email, password } = validation.data;

  //rate limiter for email verification

  const rateLimitKey = `register-rate-limiter:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res
      .status(429)
      .json({ message: "Too many requests please try again later" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const storeData = JSON.stringify({
    name,
    email,
    password: hashedPassword,
  });

  await redisClient.set(verifyKey, storeData, { EX: 300 });

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/verify/${encodeURIComponent(verifyToken)}`;
  console.log(verifyUrl);

  const subject = "Verify Your Email for Account Verification";
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification code has been sent it will be valid for 5 minutes",
    name,
    email,
    password,
  });
});

//Verifying User

export const verifyUser = TryCatch(async (req, res) => {
  //getting token from url via req.params
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({ message: "Verification link is expired" });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  if (newUser) {
    return res
      .status(201)
      .json({
        message: "Email Verified successfully, Your account has been created",
        User: { _id: newUser._id, name: newUser.name, email: newUser.email },
      });
  }
});

//Login
export const login = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    // Zod error object
    const zodError = validation.error;

    // Make a clean list of all errors
    const allErrors = zodError.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    // Pick the first error for a simple message
    const firstErrorMessage = allErrors[0].message;

    // Send response
    return res.status(400).json({
      message: firstErrorMessage, // simple error
      errors: allErrors, // detailed list
    });
  }

  const { email, password } = validation.data;

  const rateLimiterKey = `${req.ip}:${email}`;

  const requests = await redisClient.get(rateLimiterKey);

  if (requests) {
    return res.status(429).json({ message: "Too many Requests" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 });

  const subject = "otp for verification";

  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimiterKey, "true", { EX: 60 });

  return res
    .status(200)
    .json({
      message:
        "If your email is valid an otp has been sent, it will be valid for 5 minutes",
    });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide all details" });
  }
  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);

  if (!storedOtpString) {
    return res.status(400).json({ message: "Otp Expired" });
  }

  const storedOtp = JSON.parse(storedOtpString);

  console.log("otp", otp);
  console.log("storedOtp", storedOtp);
  console.log("types:", typeof Number(otp), typeof storedOtp)
console.log("strict equal:", Number(otp) === storedOtp)
console.log("otp length:", otp.length, "stored length:", String(storedOtp).length)

  if (String(otp) !== String(storedOtp)) {
    return res.status(400).json({ message: "Invalid Otp" });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  const tokenData = await generateToken(user._id, res);

  res.status(200).json({ message: `Welcome ${user.name}`, user });
});

export const myProfile = TryCatch((req, res) => {
  const user = req.user;
  res.json(user);
});

export const refreshToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Invalid Refresh Token" });
  }
  const decode = await verifyRefreshToken(refreshToken);
  if (!decode) {
    return res.status(401).json({ message: "Invalid Refresh Token" });
  }

  revokeRefreshToken(decode.id);
  generateAccessToken(decode.id, res);
  generateRefreshToken(decode.id, res);

  return res.status(200).json({ message: "Token Refreshed" });
});

export const logout = TryCatch(async (req, res) => {
  const userId = req.user._id;

  await revokeRefreshToken(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  await redisClient.del(`user:${userId}`);

  return res.json({ message: "Logged out successfully" });
});

export const csrfController = TryCatch(async (req, res) => {
  const token = generateCsrfToken(res, req);  // res first, req second
  return res.json({ csrfToken: token });
});
