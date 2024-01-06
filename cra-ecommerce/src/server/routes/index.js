const userRouter = require('./user');
const { notFound, errHandler } = require('../middlewares/errHandler'); 
const productRouter = require('./product');//video9-25:21
const salesRouter = require('./sales');
const adminRouter = require('./admin');
const productCategoryRouter = require('./productCategory'); //video12-20:01
const blogCategoryRouter = require('./blogCategory');//video12-39:14
const blogRouter = require('./blog');//video13-13:45
const brandRouter = require('./brand');//video14-42:18
const couponRouter = require('./coupon');//video15-4:01
/* 
const orderRouter = require('./order');
const insertRouter = require('./insert');
*/

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/sales', salesRouter)
    app.use('/api/admin', adminRouter)
    app.use('/api/product', productRouter);
    app.use('/api/productCategory', productCategoryRouter);
    app.use('/api/blogCategory', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);
    app.use('/api/coupon', couponRouter);
    /* 
    
    
    
    
    
    app.use('/api/order', orderRouter);
    app.use('/api/insert', insertRouter); */


    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes;

