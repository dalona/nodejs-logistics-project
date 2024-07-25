const errorHandler = (err , req, res, next) =>{
    console.error(err.stack);
    res.status(500).json('Something went wrong trying to connnect with the Server!');
}

export default errorHandler;