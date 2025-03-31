class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack
    ){
     super(message);
this.statusCode = statusCode,
this.message= message,
this.success = false,
this.errors = errors

if(stack) {
    this.stack = stack; // If a custom stack trace is provided, use it.
} else {
    Error.captureStackTrace(this, this.constructor); // Otherwise, generate a standard stack trace.
}


    }
}

export {ApiError}