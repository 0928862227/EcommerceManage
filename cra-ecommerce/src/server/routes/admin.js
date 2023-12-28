const router = require('express').Router();
const ctrlsAdmin = require('../controllers/admin');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
/*const upload = require('../config/cloudinary.config'); */
//đây là những link api 
router.post('/register', ctrlsAdmin.register);//video2-38
router.post('/login', ctrlsAdmin.login);//video4-29:25
router.get('/current', verifyAccessToken, ctrlsAdmin.getCurrent);//video5-42:03
router.post('/refreshtoken', ctrlsAdmin.refreshAccessToken);//video6-21:29
router.get('/logout', ctrlsAdmin.logout);//video6-41:37
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrlsAdmin.deleteUser);//video8-25:09 
router.delete('/:aid', [verifyAccessToken, isAdmin], ctrlsAdmin.deleteAdmin);
router.delete('/:sid', [verifyAccessToken, isAdmin], ctrlsAdmin.deleteSales);
/*
router.get('/forgotpassword', ctrlsAdmin.forgotPassword);//video7-40:59
router.put('/resetpassword', ctrlsAdmin.resetPassword);//video7-1:02:58
router.get('/', [verifyAccessToken, isAdmin], ctrlsAdmin.getUsers);//video8-11:30
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrlsAdmin.deleteUser);//video8-25:09 
router.delete('/current', [verifyAccessToken], ctrlsAdmin.updateUser);//video8-35:48s 
router.put('/:uid', [verifyAccessToken, isAdmin], ctrlsAdmin.updateUserByAdmin);//video8-40:59 */
/* router.post('/mock', ctrlsAdmin.createUsers);
router.put('/finalregister/:token', ctrlsAdmin.finalRegister);




// router.use(verifyAccessToken);
// router.use(isAdmin);

router.put('/current', [verifyAccessToken], upload.single('avatar'), ctrlsAdmin.updateUser);
router.put('/address', [verifyAccessToken], ctrlsAdmin.updateUserAddress);
router.put('/cart', [verifyAccessToken], ctrlsAdmin.updateCart);
router.delete('/remove-cart/:pid', [verifyAccessToken], ctrlsAdmin.removeProductInCart);

 */
module.exports = router


// CRUD | Create - Read - Update - Delete | 
//  ====>   POST - GET  -  PUT   - DELETE
// CREATE ( nghĩa là POST) + PUT thường gửi ở body ,ko hiển thị trên trình duyệt
// GET + DELETE thường gửi ở query (có kí tự : ? & ) ,hiển thị trên trình duyệt