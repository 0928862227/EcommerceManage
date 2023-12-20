const router = require('express').Router();//video9-23:54
const ctrlsProducts = require('../controllers/product');//video9-23:54
const ctrlsSales = require('../controllers/sales');
const { verifyAccessToken, isAdmin ,isSales} = require('../middlewares/verifyToken');//video9-23:54
//const upload = require('../config/cloudinary.config');

router.post('/', [verifyAccessToken, isSales],ctrlsSales.createProduct);
router.get('/', ctrlsProducts.getProducts);//video9-38:31
router.get('/:pid',[verifyAccessToken, isAdmin], ctrlsProducts.getProduct);//video9-34:04
/*router.post('/', [verifyAccessToken, isAdmin], upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.createProduct);*/ 

/*
router.put('/ratings', verifyAccessToken, ctrls.ratings);
router.put('/uploadimg/:pid', [verifyAccessToken, isAdmin], upload.array('images', 10), ctrls.uploadImgsPro);


router.put('/variants/:pid', [verifyAccessToken, isAdmin], upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.addVarriant);
router.put('/:pid', [verifyAccessToken, isAdmin], upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);


*/
module.exports = router 