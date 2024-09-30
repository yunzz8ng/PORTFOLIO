/* .routes/index.js */
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();
const { User } = require('../models/index')
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'yunzzang';
// const posts = require('./posts');


// router.use('/posts', posts);

router.post('/join', async (req, res) => {
    const { id, name, email, phoneNumber, password, confirmpw } = req.body;

    const nameReg = /^[a-zA-Z0-9]{3,}$/

    try {
        if (!nameReg.test(name)) {
            return res.status(412).send({ "errorMessage": "ID의 형식이 일치하지 않습니다." })
        }

        if (password.length < 4) {
            return res.status(412).send({ "errorMessage": "패스워드의 형식이 일치하지 않습니다." })
        }

        if (password === name) {
            return res.status(412).send({ "errorMessage": "패스워드와 닉네임이 일치합니다." })
        }

        if (password !== confirmpw) {
            return res.status(412).send({ "errorMessage": "패스워드가 일치하지 않습니다." })
        }


        const existUser = await User.findAll({
            where: { id: id }
        })

        if (existUser.length) {
            return res.status(412).send({ "errorMessage": "중복된 아이디입니다." })
        }

        await User.create({
            id: id,
            name: name,
            phoneNumber: phoneNumber,
            password: password,
            email: email
        })


        res.status(201).send({ message: "회원가입 성공!" })

    } catch (err) {
        console.log(err);
        res.status(400).send({ "errorMessage": "요청한 데이터 형식이 올바르지 않습니다." })
    }


});

router.post("/login", async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findOne({
            where: { id },
        });

        if (!user || user.password !== password) {
            return res
                .status(412)
                .send({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
        }

        const token = jwt.sign(
            { name: user.name, userId: user.id },
            SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("token", token);

        return res.json({ token: token });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ errorMessage: "로그인에 실패하였습니다." });
    }
})


router.get("/", user.index);
// router.post("/join", user.post_user);

router.get("/login", user.login);
router.post("/login", user.post_login);

router.post("/edit", user.edit);
router.patch("/edit", user.patch_user);
router.delete("/delete", user.delete_user);

module.exports = router; 
