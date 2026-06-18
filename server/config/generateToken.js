import jwt from "jsonwebtoken";
import redisClient from "./redis.js";

//we will receive id and send response
export const generateToken = async(id, res)=>{

  //Access Token

  const accessToken = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"1m"});
  const refreshToken = jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {expiresIn:"7d"});

  //session base bnane ka 1 tarika ye hai ke refresh token ko redis mai save kro agr user dusri jaga login krega to uska refresh token update hojayga or purana refresh token expire hojayga or wo logged out hojayga purana

  const refreshTokenKey = `refresh_token:${id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60 , refreshToken)

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly:true,
    sameSite:"none",
    secure:true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return {accessToken, refreshToken};

}

export const verifyRefreshToken = async(refreshToken)=>{
  try {
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await redisClient.get(`refresh_token:${decode.id}`)
    if (refreshToken === storedToken) {
      return decode;
    }
    return null;
  } catch (error) {
    return null;
  }
}


export const generateAccessToken = async(id, res)=>{
  
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"1m"})
    res.cookie("access_token", accessToken, {
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge: 1 * 60 * 1000
    })
}


export const revokeRefreshToken = async(userId)=>{
  await redisClient.del(`refresh_token:${userId}`);
}