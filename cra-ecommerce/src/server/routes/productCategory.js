const router = require('express').Router();
const ctrls = require('../controllers/productCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory);//vid12-21:15
router.get('/', ctrls.getCategories);//vid12-30:21
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory);//vid12-30:21
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory);//vid12-30:21



module.exports = router