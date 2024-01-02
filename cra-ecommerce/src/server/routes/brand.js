const router = require('express').Router();
const ctrls = require('../controllers/brand');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBrand);//video14-41:17
router.get('/', ctrls.getBrands);
router.put('/:brid', [verifyAccessToken, isAdmin], ctrls.updateBrand);//video14-41:33
router.delete('/:brid', [verifyAccessToken, isAdmin], ctrls.deleteBrand);



module.exports = router