const authRoutes=require('./auth');
const categoryRoutes = require('./category');
const serviceRoutes= require('./service');
const userRoutes = require('./user');

const mountRouts=(app)=>{
app.use('/v1/auth',authRoutes)
app.use('/v1/categories', categoryRoutes);
app.use('/v1/services', serviceRoutes);
app.use('/v1/users', userRoutes);
}
module.exports=mountRouts;