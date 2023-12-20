const { default: mongoose } = require('mongoose');
mongoose.set('strictQuery', false);
const url = "mongodb://0.0.0.0:27017/cra-ecommerce"
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(url);
        if (conn.connection.readyState === 1) {
            console.log('Kết nối cơ sở dữ liệu thành công!');
        } else {
            console.log('Đang kết nối cơ sở dữ liệu');
        }
    } catch (error) {
        console.log('Kết nối cơ sở dữ liệu thất bại!');
        console.log('Kết nối thất bại ở cổngMongoDB URI:', url);
        
        throw new Error(error)
    }
}
module.exports = dbConnect
