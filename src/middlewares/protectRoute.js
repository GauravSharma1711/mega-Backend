import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/async-handler.js';
 
 const protectRoute = asyncHandler((req,res,next)=>{
        
    const {accessToken} = req.cookies;

    if (!accessToken) {
        throw new ApiError(401, "Access token missing");
      }

      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      if(!decoded){
        throw new ApiError(403,"Unauthorized")
      }

      req.user={
        id: decoded._id,
        email: decoded.email,    
      }
     
      

      next();



 })

   
export default protectRoute