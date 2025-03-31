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
       .isLength({min:6}).withMessage("password length should be minimum 6")
       .notEmpty().withMessage("Password is required")
    ]
}


const userLoginValidator = ()=>{

return [

body("email")
.trim()
.isEmpty().withMessage("Email is required")
.isEmail().withMessage("Email is invalid"),

body("password")
.length({min:6}).withMessage("Password length should be minimum of 6 ")



       ]

   }


export {userRegistrationValidator,userLoginValidator}