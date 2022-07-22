const User = require('../models/UserModel');
const { verifyTokenAndAutorization, verifyTokenAdmin } = require('../routes/verifyToken')
const dotenv = require('dotenv');
const CriptoJS = require('crypto-js');

dotenv.config();

const { SECRET } = process.env;

const router = require("express").Router();

// atualizando usuario
router.put('/:id', verifyTokenAndAutorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CriptoJS.AES.encrypt(
            req.body.password, 
            SECRET
        ).toString()
    }
    try {
        const upDateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body // setando no banco de dados
            }, 
            {new: true }
        );
        res.status(200).json(upDateUser);
    } catch (error) {
        res.status(403).json(" Error ")
    }
});

router.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(201).json(' DELETE ');
    } catch (error) {
        res.sendStatus(404);
    }
});

// get user 
router.get('/find/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(404).json(' Error ')
    }
});

// pegando todos os usuarios OBS: necessario ser ADM
router.get('/findAllUser', verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json(' Error ')
    }
})

router.get('/stats', verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    //pegando as estatisticas do ano passado
    const lestYear = new Date(date.setFullYear(date.getFullYear() -1));
    try {
        const data = await User.aggregate([
            {   $match: { createdAt: { $gte: lestYear } } },
            {
                $project: {
                    month: { $month: ' $createdAt '},
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;