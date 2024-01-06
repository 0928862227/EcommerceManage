const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');


//---------------------------Tạo phiếu mua hàng-------------------\\

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) throw new Error('Thiếu thông tin');

    //set ngày hết hạn phiếu mua hàng
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000
    });
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Không thể tạo phiếu mua hàng!'
    });
})

//---------------------Lấy phiếu mua hàng ------------\\

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAd -updatedAd');
    return res.json({
        success: response ? true : false,
        getCoupons: response ? response : 'Không thể lấy phiếu mua hàng'
    });
})


//---------------------------Cập nhật phiếu mua hàng---------------\\

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Thiếu thông tin');
    if (req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Chưa cập nhật phiếu mua hàng'
    });
})

//------------------------Xóa phiếu mua hàng------------------\\

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Chưa thể xóa phiếu mua hàng!'
    });
})


module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
}