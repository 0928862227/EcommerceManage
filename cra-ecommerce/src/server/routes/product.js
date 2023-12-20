const router = require('express').Router();//video9-23:54
const ctrlsProducts = require('../controllers/product');//video9-23:54
const ctrlsSales = require('../controllers/sales');
const { verifyAccessToken, isAdmin ,isSales} = require('../middlewares/verifyToken');//video9-23:54
//const upload = require('../config/cloudinary.config');

router.post('/', [verifyAccessToken, isSales],ctrlsSales.createProduct);
router.get('/', ctrlsProducts.getProducts);//video9-38:31
router.put('/:pid', [verifyAccessToken, isAdmin],ctrlsProducts.updateProduct);//video9-43:01
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrlsProducts.deleteProduct);//video9-48:10 
/* router.put('/:pid', [verifyAccessToken, isAdmin], upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.updateProduct); */
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




*/
module.exports = router 