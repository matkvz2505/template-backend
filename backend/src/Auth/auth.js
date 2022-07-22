const router = require("express").Router();
const User = require("../models/UserModel");
const dotenv = require('dotenv');
const CriptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');

dotenv.config();

const {
    SECRET,
    JWT_SECRET
} = process.env;
    
router.post('/Autorization', async (req, res ) => {
    try{
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CriptoJS.AES.encrypt(
                req.body.password, 
                SECRET
            ).toString(),
        });
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch(err){
        console.log(err);
    }
}),
    // login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('Credenciais Invalidas user');

        const hashedPassaWord = CriptoJS.AES.decrypt(
            user.password,
            SECRET
        );
        const Originpassword = hashedPassaWord.toString(CriptoJS.enc.Utf8);
        Originpassword !==req.body.password && res.status(401).json('Credenciais Invalidas password');
        
        const accessToken = JWT.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            JWT_SECRET,
            {expiresIn: '3d'}
        );

        const { passaword, ...others } = user._doc;

        res.status(201).json({...others, accessToken });
    }catch(err) {
        console.log(err);
    }
});
module.exports = router;
