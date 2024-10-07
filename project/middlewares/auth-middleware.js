const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers.cookie ? req.headers.cookie.split("token=")[1] : null;
    if (!token) {
        if (req.url == '/') {
            return next();
        }
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findByPk(userId).then((user) => {
            const reqUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            res.locals.user = reqUser;
            return next();
        });
    } catch (err) {
        console.log(err.message);
        if (err.message == 'jwt expired' || err.message == 'jwt malformed') {
            res.clearCookie('token');
            res.next()
            // res.next();
        } 
        res.send(500).send({
            message: '서버 오류 발생',
            error: err
        })
    }
};