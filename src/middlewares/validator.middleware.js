import {validationResult} from 'express-validator'
import ApiError from '../utils/ApiError.js'

export const validate = (req,res,next) => {

    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next()
    }

    const extractedError = [];

    errors.array().map((error)=>{
        extractedError.push({
            [error.path]:error.message
        })
    })


    throw new ApiError(422,"Received data is not valid",extractedError)

}

