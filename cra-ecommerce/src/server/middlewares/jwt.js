/* -------------------Creat,Access/Refresh Token vì Token đánh dấu lượt truy cập để có thể truy cập lần sau --------------------*/

const jwt = require('jsonwebtoken');
//hash id_user & role....................//Tạo token đánh dấu lượt truy cập(decode) 
const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, "${process.env.JWT_SECRET}", { expiresIn: '7d' });


//hash id_user ......................//Tạo lại token đánh dấu lượt truy cập nếu token cũ đã hết hạn
const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, "${process.env.JWT_SECRET}", { expiresIn: '7d' });


module.exports = {
    generateAccessToken, 
    generateRefreshToken
}