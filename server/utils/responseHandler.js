const sendSuccess = (res, statusCode = 200, message = "Success", data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

const sendError = (res, statusCode = 500, message = "Something Went Wrong", error = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error?.message || error,
    });
}

module.exports = {sendSuccess, sendError};