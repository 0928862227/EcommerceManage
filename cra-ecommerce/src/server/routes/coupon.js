const route = require('express').Router();
const ctrls = require('../controllers/coupon');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

route.post('/', [verifyAccessToken, isAdmin], ctrls.createCoupon);
route.get('/', ctrls.getCoupons);
route.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon);
route.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon);

module.exports = route;