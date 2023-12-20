//khi user nhập vào những link api ko đc hỗ trợ or k khớp thì sẽ thông báo lỗi 
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy link ${req.originalUrl}`)
    res.status(404);
    next(error);
}

/* sửa mã err từ 200 thành 500 để dễ đọc hơn trên postman vs terminal
hàm này catch err từ file controller 
 đây là hàm mẫu từ express bắt buộc 4 tham số */
const errHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        mes:  error?.message,
    })
}

module.exports = {
    notFound,
    errHandler
}