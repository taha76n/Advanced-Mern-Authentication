import jwt from "jsonwebtoken";
import redisClient from "./redis.js";

//we will receive id and send response
export const generateToken = async (id, res) => {
  //Access Token

  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  //session based bnane ka 1 tarika ye hai ke refresh token ko redis mai save kro agr user dusri jaga login krega to uska refresh token update hojayga or purana refresh token expire hojayga or wo logged out hojayga purana

  const refreshTokenKey = `refresh_token:${id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export const generateAccessToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
};

export const generateRefreshToken = async (id, res) => {
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  await redisClient.setEx(
    `refresh_token:${id}`,
    7 * 24 * 60 * 60,
    refreshToken
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await redisClient.get(`refresh_token:${decode.id}`);
    if (refreshToken === storedToken) {
      return decode;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
};
