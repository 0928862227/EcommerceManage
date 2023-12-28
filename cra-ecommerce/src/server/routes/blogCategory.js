const router = require('express').Router();
const ctrls = require('../controllers/blogCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory);//video12-38:37
router.get('/', ctrls.getCategories);//video12-38:37
router.put('/:bcid', [verifyAccessToken, isAdmin], ctrls.updateCategory);//video12-38:37
router.delete('/:bcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory);//video12-38:37



module.exports = router