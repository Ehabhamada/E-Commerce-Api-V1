
const globalErrorHandler=(err,req,res,next)=>{

    const stack = err?.stack
    const statusCode = err?.statusCode || 500;
    const message = err?.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            status: statusCode,
            message: message,
            stack: stack,
        }
    });
}


module.exports = globalErrorHandler