const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/pagamento', (req, res) => {
    stripe.charges.create({
        source: req.nody.tokenId,
        amount: req.body.amount,
        currency: 'brl',
    }, 
    (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).json(stripeErr);
        } else{
            res.status(200).json(stripeRes);
        }
    });
});

module.exports = router;