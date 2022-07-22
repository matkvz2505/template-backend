const express =require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoute = require('../src/routes/user');
const authRoute = require('../src/Auth/auth');
const productRoute = require('../src/routes/product');
const orderRoute = require('../src/routes/order');
const cartRoute = require('../src/routes/cart');
const testeRoute = require('../src/routeTeste/teste');
const { json } = require('express');

dotenv.config();

const app = express();

const { 
    MONGO_DB,
    PORT
} = process.env;

mongoose.connect(MONGO_DB).then(() => 
console.log('Banco Ok')).catch((err) => {
    console.log(err);
});

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)
app.use('/api/teste', testeRoute);

app.listen(PORT, () => {
    console.log('BackEnd Online');
})

exports.module = app;