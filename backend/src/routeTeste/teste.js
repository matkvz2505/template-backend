const router = require('express').Router()

router.get('/hello', (req, res) => {
    try {
        return res.send("TESTE SENDO TRANSMITIDO").statusCode(200) 
    } catch (error) {
        return res.send(error)
    }
});

module.exports = router;