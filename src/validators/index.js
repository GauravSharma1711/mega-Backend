import {body} from "express-validator"


const userRegistrationValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),

       body("username")
       .trim()
       .notEmpty().withMessage("username is required")
       .isLength({min:3}).withMessage("min length should be 3")
       .isLength({max:13}).withMessage("max length should be 13"),

       body("password")
       .notEmpty().withMessage("Password is required")
       .isLength({min:6}).withMessage("password length should be minimum 6")
    ]
}


const userLoginValidator = ()=>{

return [

body("email")
.notEmpty().withMessage("Email is required")
.isEmail().withMessage("Email is invalid"),

body("password")
.isLength({min:6}).withMessage("Password length should be minimum of 6 ")



       ]

   }

   const forgotPasswordValidator = ()=>{
    return [

        body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
    ]        
   }

   const resetPasswordValidator = ()=>{
    return [

        body("password")
        .isLength({min:6}).withMessage("Password length should be minimum of 6 ")
    
    ]        
   }

   const changePasswordValidator = (()=>{
    
    return [

  body('oldPassword')
  .notEmpty().withMessage('Old password is required'),

  body('newPassword')
  .isLength({ min: 6 }).withMessage('New password must be at least 8 characters long')
 
    ]
   })



export {userRegistrationValidator,userLoginValidator,forgotPasswordValidator,
    resetPasswordValidator,changePasswordValidator
}