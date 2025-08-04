const authRoutes=require('./auth');
const categoryRoutes = require('./category');
const serviceRoutes= require('./service');
const userRoutes = require('./user');
const orderRoutes = require('./order');

const mountRouts=(app)=>{
app.use('/v1/auth',authRoutes)
app.use('/v1/categories', categoryRoutes);
app.use('/v1/services', serviceRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/orders', orderRoutes);
}
module.exports=mountRouts;