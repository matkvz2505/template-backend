const { verifyTokenAndAutorization, verifyTokenAdmin } = require('../routes/verifyToken')
const Order = require('../models/Order');

const router = require("express").Router();

// Create
router.post('/', verifyTokenAdmin, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const saveOrder = await newOrder.save();
        res.status(201).json(saveOrder);
        console.log(saveProduct)
    } catch (error) {
        res.status(404).json(" Error Create - Orders ")
    }
});

// UpDate
router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const upDateOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body // setando no banco de dados
            }, 
            { new: true }
        );
        res.status(200).json(upDateOrder);
    } catch (error) {
        res.status(403).json(" Error Put - Orders ")
    }
});

router.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.sendStatus(201).json(' DELETE ');
    } catch (error) {
        res.sendStatus(404);
    }
});

// find Order
router.get('/findOrder/:userid', async (req, res) => {
    try {
        const order = await Order.findOne({userid: req.params.userid});
        res.sendStatus(201).json(order);
    } catch (error) {
        res.status(404).json(' Error - FindOrders ');
    }
});

router.get('/findAll', verifyTokenAdmin, async(req, res) => {
    try {
        const orders = await Order.find();
        res.status(201).json(orders);
    } catch (error) {
        res.status(404).json(' Error FindAll - Orders ');
    }
});

router.get('/rendaMensal', verifyTokenAdmin, async(req, res) => {
    const data = new Date();
    const lastMonth = new Date(data.setMonth(data.getMonth() - 1));
    const previusMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order.aggregate([
            { $match: { createAt: { $gte: previusMonth } } },
            {
                $project: {
                    month: { $month: '$createAt'},
                    sales: '$amount',
                },
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales'},
                },   
            },
        ]);
        res.status(201).json(income);
    }catch (error) {
        res.status(404).json(' Error Renda mensal ');
    }
})

module.exports = router;