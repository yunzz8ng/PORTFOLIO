const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const SECRET_KEY = "yunzzang";

module.exports = (req, res, next) => {
    const token = req.headers.cookie.split("token=")[1];
    console.log('req.headers.cookie');
    console.log(req.headers.cookie);
    if (!token) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }

    try {
        const { userId } = jwt.verify(token, SECRET_KEY);
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            return next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};