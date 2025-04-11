import { body } from "express-validator";

const noteCreationValidator  = ()=>{
    return [

        body('content')
        .notEmpty().withMessage("content is required"),

    ]
}

const noteUpdationValidator  = ()=>{
    return [

        body('content')
        .notEmpty().withMessage("content is required"),

    ]
}

export {noteCreationValidator,noteUpdationValidator}