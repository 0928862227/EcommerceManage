const userRouter = require('./user');
const { notFound, errHandler } = require('../middlewares/errHandler'); 
const productRouter = require('./product');
const salesRouter = require('./sales');
const adminRouter = require('./admin');
/* 
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');
const blogRouter = require('./blog');
const brandRouter = require('./brand');
const couponRouter = require('./coupon');
const orderRouter = require('./order');
const insertRouter = require('./insert');
*/

// this function will be call in src/server/server.js (38:14)
const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/sales', salesRouter)
    app.use('/api/admin', adminRouter)
    app.use('/api/product', productRouter);//video9-25:21
    /* 
    app.use('/api/productCategory', productCategoryRouter);
    app.use('/api/blogCategory', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/insert', insertRouter); */


    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes;

