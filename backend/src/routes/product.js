const User = require('../models/Product');
const { verifyTokenAndAutorization, verifyTokenAdmin } = require('../routes/verifyToken')
const dotenv = require('dotenv');
const CriptoJS = require('crypto-js');
const Product = require('../models/Product');

dotenv.config();

const router = require("express").Router();

// atualizando usuario
router.post('/', verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    //try {
        const saveProduct = await newProduct.save();
        res.status(201).json(saveProduct);
        console.log(saveProduct)
    //} catch (error) {
        //res.status(404).json(" Error ")
    //}
});

router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const upDateProduct = await User.findByIdAndUpdate(
            req.params.id, 
            {
            $set: req.body // setando no banco de dados
            }, 
            { new: true }
        );
        res.status(200).json(upDateProduct);
    } catch (error) {
        res.status(403).json(" Error ")
    }
});

router.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.sendStatus(201).json(' DELETE ');
    } catch (error) {
        res.sendStatus(404);
    }
});

router.get('/findProduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.sendStatus(201).json(product);
    } catch (error) {
        res.status(404).json(' Error ');
    }
});

router.get('/findAllProducts', async(req, res) => {
    const qNew = req.query.new;
    const qCategory =req.query.category;

    try {
        let products;

        if(qNew) {
            products = await Product.find().sort({createAt: -1}).limit(5);
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        }else {
            products = await Product.find();
        }
        res.status(201).json(products);
    } catch (error) {
        res.status(404).json(' Error ');
    }
})

module.exports = router;