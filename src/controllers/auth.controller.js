import asyncHandler from '../utils/async-handler.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError  from '../utils/ApiError.js'
import User from '../models/user.models.js'
import crypto from 'crypto'
import jwt from  'jsonwebtoken'
import bcrypt from 'bcryptjs'
import setCookie from '../utils/setCookie.js'


import { sendMail } from '../utils/email.js'
import {emailVerificationMailGenerator,forgotPasswordMailGenerator} from '../utils/email.js'



const registerUser = asyncHandler(async(req,res)=>{

    const {email,username,fullName,password,role} = req.body

    //validation 

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new ApiError(400,"User already exists");
    }

    
    const user =  new User({
        username,
        fullName,
        email,
        password,
        role
    })

    const {unhashedToken,hashedToken,tokenExpiry} = await user.generateTemporaryToken()
    const verificationUrl = `http://localhost:8000/api/v1/auth/verify/${unhashedToken}`
    user.emailVerificationToken=hashedToken;
    user.emailVerificationExpiry= tokenExpiry

      



      sendMail({
        email:user.email,
        subject:"verify email account",
        mailgenContent:emailVerificationMailGenerator(
            username,
            verificationUrl, 
          )})

          await user.save();
    
          return res.status(201).json(
            new ApiResponse(201,"User registered successfully",user)
          )



})

const verifyUser = asyncHandler(async(req,res)=>{
      
    const unhashedToken = req.params.unhashedToken;

    const user = await User.findOne({
    emailVerificationToken: crypto.createHash("sha256")
            .update(unhashedToken)
            .digest("hex"),

            emailVerificationExpiry:{$gt:Date.now()},
    })

    if(!user){
        throw new ApiError(403,"Invalid or expired token")
    }

    user. isEmailVerified=true;
    user.emailVerificationToken=null;
    user.emailVerificationExpiry=null;

    await user.save();

    return res.status(200).json(
        new ApiResponse(201,{message:"user verified successfully"})
    )


})


const loginUser = asyncHandler(async(req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(403,"Incorrect password");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generaterRefreshToken();

  setCookie(res,accessToken,refreshToken);

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200,{message:"user logged in successfully"})
  )


})

const logoutUser = asyncHandler(async(req,res)=>{

    const user = await req.user._id;

    if(user){
        user.refreshToken = null;
        await user.save();
    }

    res.clearCookie("accessToken",{
        httpOnly: true,
    sameSite: "Strict",
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
      });


      return res.status(200).json(
        new ApiResponse(201,{message:"user logged out successfully"})
      )

})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const {refreshToken} = req.cookies
    

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
      }

      const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

    if(!decoded){
        throw new ApiError(403, "Invalid refresh token");
      }

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(403, "User not logged in or token mismatch");
      }




  
const newaccessToken = await user.generateAccessToken();
const newrefreshToken = await user.generaterRefreshToken();

setCookie(res,newaccessToken,newrefreshToken);

user.refreshToken = newrefreshToken;
await user.save();

return res.status(200).json(
new ApiResponse(200,{message:"access token refreshed successfully"})
)


})

const forgotPassword = asyncHandler(async(req,res)=>{

    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404,"User not found");
    }
    const {unhashedToken,hashedToken,tokenExpiry} = await user.generateTemporaryToken()
    const passwordResetUrl = `http://localhost:8000/api/v1/auth/resetpassword/${unhashedToken}`
    user.forgotPasswordToken=hashedToken;
    user.forgotPasswordExpiry=tokenExpiry;
await user.save();
    const username = user.username;

    sendMail({
        email:user.email,
        subject:"reset your password",
        mailgenContent:forgotPasswordMailGenerator(
            username,
            passwordResetUrl, 
          )})

          return res.status(200).json({ message: "reset mail sent" });


})


const resetPassword = asyncHandler(async(req,res)=>{

    const {password} = req.body;

    const unhashedToken = req.params.unhashedToken;

    const hashedToken =  crypto.createHash("sha256")
        .update(unhashedToken)
        .digest("hex")

        const user = await User.findOne({
            forgotPasswordToken :hashedToken,
            forgotPasswordExpiry:{$gt:Date.now()}
        })

        if(!user){
        throw new ApiError(403,"invalid or expired token");
        }

        user.password = password;
        await user.save();

        return res.status(200).json({ message: "password reset successful" });



})


const getCurrentUser = asyncHandler(async(req,res)=>{
    const id  = req.user._id;

    const user = await User.findById(id);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    return res.status(200).json(
        new ApiResponse(200,{message:"user is",user})
    )

})


const changePassword = asyncHandler(async(req,res)=>{
  const {currentPassword,newPassword} = req.body;
    const userId= req.user._id;

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }

    if(currentPassword!==user.password){
        throw new ApiError(403,"Incorrect password");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200,{message:"password changes successful"})
    )

})

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the user's email is already verified
    if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate a new verification token
    const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    const verificationUrl = `http://localhost:8000/api/v1/auth/verify/${unhashedToken}`;

    // Update user with new token and expiry
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    // Save the updated user information
    await user.save();

    // Send the verification email
    sendMail({
        email: user.email,
        subject: "Verify Your Email Account",
        mailgenContent: emailVerificationMailGenerator(user.username, verificationUrl),
    });

    return res.status(200).json({ message: "Verification email resent successfully." });
});


export {registerUser,verifyUser,loginUser,logoutUser ,refreshAccessToken,
    forgotPassword,resetPassword,getCurrentUser,changePassword,resendVerificationEmail}