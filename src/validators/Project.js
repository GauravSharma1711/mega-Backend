import { body } from "express-validator";


const projectCreationValidator = ()=>{
    return [

        body("name")
       .trim()
        .notEmpty().withMessage("name is required"),

        body("description")
        .notEmpty().withMessage(" description is required"),

        body("createdBy")
        .notEmpty().withMessage("createdBy is required")
        .isMongoId()
        .withMessage("created by must be a valid mongo ID")


    ]
}

const projectUpdationValidator = ()=>{
    return [
    body("name")
    .trim()
     .notEmpty().withMessage("name is required"),

     body("description")
     .notEmpty().withMessage(" description is required"),
    ]

}

export {projectCreationValidator,projectUpdationValidator}