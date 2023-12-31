const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrls = require('../controllers/blog');
//const upload = require('../config/cloudinary.config');

router.get('/', ctrls.getBlogs);//video13-32:15
router.get('/blog/:bid', ctrls.getBlog);//video14-23:20
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog);//video14-4:33
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog);//video14-4:33
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog);//video13-19:11
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog);//video13-28:37
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog);//video14-33:17
/* router.put('/img/:bid', [verifyAccessToken, isAdmin], upload.single('image'), ctrls.uploadImgBlog);

 */


module.exports = router;