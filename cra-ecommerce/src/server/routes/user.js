const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
/*const upload = require('../config/cloudinary.config'); */
//đây là những link api 
router.post('/register', ctrls.register);//video2-38
router.post('/login', ctrls.login);//video4-29:25
router.get('/current', verifyAccessToken, ctrls.getCurrent);//video5-42:03
router.post('/refreshtoken', ctrls.refreshAccessToken);//video6-21:29
router.get('/logout', ctrls.logout);//video6-41:37
router.get('/forgotpassword', ctrls.forgotPassword);//video7-40:59
router.put('/resetpassword', ctrls.resetPassword);//video7-1:02:58
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers);//video8-11:30
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser);//video8-25:09 
router.delete('/current', [verifyAccessToken], ctrls.updateUser);//video8-35:48s 
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);//video8-40:59
/* router.post('/mock', ctrls.createUsers);
router.put('/finalregister/:token', ctrls.finalRegister);




// router.use(verifyAccessToken);
// router.use(isAdmin);

router.put('/current', [verifyAccessToken], upload.single('avatar'), ctrls.updateUser);
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress);
router.put('/cart', [verifyAccessToken], ctrls.updateCart);
router.delete('/remove-cart/:pid', [verifyAccessToken], ctrls.removeProductInCart);

 */
module.exports = router


// CRUD | Create - Read - Update - Delete | 
//  ====>   POST - GET  -  PUT   - DELETE
// CREATE ( nghĩa là POST) + PUT thường gửi ở body ,ko hiển thị trên trình duyệt
// GET + DELETE thường gửi ở query (có kí tự : ? & ) ,hiển thị trên trình duyệt