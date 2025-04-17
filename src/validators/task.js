import {body} from "express-validator"

const taskCreationValidator = ()=>{
    return [
        body("title")
        .notEmpty().withMessage("title is required"),
       

       body("description")
       .notEmpty().withMessage("description is required"),
      
       body("attachments")
       .notEmpty().withMessage("attachments is required")
       
    ]
}

const taskUpdationValidator = ()=>{
    return [
        body("title")
        .notEmpty().withMessage("title is required"),
       

       body("description")
       .notEmpty().withMessage("description is required"),
      
       body("attachments")
       .notEmpty().withMessage("attachments is required")
       
    ]
}

const subTaskCreationValidator = ()=>{
    return [
        body("title")
        .notEmpty().withMessage("title is required"),
    ]
}

const subTaskUpdationValidator = ()=>{
    return [
        body("title")
        .notEmpty().withMessage("title is required"),
    ]
}


export {taskCreationValidator,taskUpdationValidator,subTaskCreationValidator,subTaskUpdationValidator}