const sendSuccess = (res, statusCode = 200, message = "Success", data = {}) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data
    });
}

const sendError = (res, statusCode = 400, message = "Something Went Wrong", error = {}) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: error?.message || error,
    });
}

module.exports = { sendSuccess, sendError };