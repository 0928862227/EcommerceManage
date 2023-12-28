const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Declare the Schema of the Mongo model
// cột ~ collection 
// hàng ~ documment
var adminSchema = new mongoose.Schema({
    name: { //<-- collection
        type: String,
        required: true,
        //required: true là môngo hiểu nó sẽ là dữ liệu bắt buộc phải có trong bảng
    },
    email: {
        type: String,
        required: true,
        unique: true,// validate :gmail không được trùng (set ngay tại dbMongo)
    },
    avatar: {
        type: String,
    },
    mobile: {
        type: String,
        
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [1945, 1975 ,1999],
        default: 1975,
    },
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: Number,
    }],
    address: String,
    //lưu những id của bảng product vào mảng dưới ,giống khóa phụ trong sql
    wistlist: [
        { type: mongoose.Types.ObjectId, ref: 'Product' }
    ],
    //khóa tài khoản 
    isBlocked: {
        type: Boolean,
        default: false,
    },
    //quên mật khẩu
    refreshToken: {
        type: String,
    },
    //đổi mật khẩu nếu 
    passwordChangeAt: {
        type: String,
    },
    //1 mã xác nhận gửi qua mail để xác thực người dùng nếu
    // token này trùng với token trong db
    passwordResetToken: {
        type: String,
    },
    // thời gian còn hạn của token trên 
    passwordResetExpires: {
        type: String,
    },
    //thời gian hết hạn ,có hiệu lực trong khoản thời gian của mã xác nhận trên 
    registerToken: {
        type: String,
    }
}, {
    timestamps: true,//kiểu thời gian 
});

// hàm mã hóa mật khẩu .lý thuyết bỏ muối và nước v3/10:50p
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

adminSchema.methods = {
    //-------------Check Password của 1 tài khoản-------\\

    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },

    //----------------Reset Password-----------------------\\
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordReset  = Date.now() + 15 * 60 * 1000 //(hạn 15 phút)
        return resetToken
    } 
} 
module.exports = mongoose.model('Admin', adminSchema);