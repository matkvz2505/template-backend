const User = require('../models/Product');
const { verifyTokenAndAutorization, verifyTokenAdmin } = require('../routes/verifyToken')
const dotenv = require('dotenv');
const CriptoJS = require('crypto-js');
const Cart = require('../models/Cart');

dotenv.config();

const router = require("express").Router();

// Create
router.post('/', verifyTokenAdmin, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(201).json(saveCart);
        console.log(saveProduct)
    } catch (error) {
        res.status(404).json(" Error ")
    }
});

// UpDate
router.put('/:id', verifyTokenAndAutorization, async (req, res) => {
    try {
        const upDateCart = await Cart.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body // setando no banco de dados
            }, 
            { new: true }
        );
        res.status(200).json(upDateCart);
    } catch (error) {
        res.status(403).json(" Error ")
    }
});

router.delete('/:id', verifyTokenAndAutorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.sendStatus(201).json(' DELETE ');
    } catch (error) {
        res.sendStatus(404);
    }
});

// find Cart
router.get('/findCart/:userid', async (req, res) => {
    try {
        const cart = await Cart.findOne({userid: req.params.userid});
        res.sendStatus(201).json(cart);
    } catch (error) {
        res.status(404).json(' Error ');
    }
});

router.get('/findAll', verifyTokenAdmin, async(req, res) => {
    try {
        const carts = await Cart.find();
        res.status(201).json(carts);
    } catch (error) {
        res.status(404).json(' Error ');
    }
})

module.exports = router;