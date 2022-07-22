const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { JWT_SECRET } = process.env;

const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        JWT.verify(token, JWT_SECRET, (err, user) => {
            if(err) return res.status(403).json('Token invalid');
            req.user = user;
            next();
        })
    }else {
        return res.status(401).json('Você não está autenticado ');
    }
};

const verifyTokenAndAutorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else {
            res.status(403).json(' Error ')
        }
    });
};

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }else {
            res.status(403).json(' Error ')
        }
    });
};

module.exports = { 
    
    verifyToken, 
    verifyTokenAndAutorization, 
    verifyTokenAdmin 
} ;