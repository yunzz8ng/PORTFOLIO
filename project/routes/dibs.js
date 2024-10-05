const express = require("express");
const { Festival, Dibs } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


router.post('/dibs', authMiddleware, async (req, res) => {

    const dibId = req.body.dibId;
    const userId = res.locals.user.id;
    // const userId = 'ㅁㅁ';

    const dibs = await Dibs.findOne({
        where: {
            dib_id: dibId
        }
    })

    if (!dibs) {
        return res.json({
            success: false,
            message: '찜 항목을 찾을 수 없습니다',
        })
    }

    if (dibs.dataValues.user_id !== userId) {
        return res.json({
            success: false,
            message: '비정상적 접근',
        })
    }
    console.log(dibs);

    let result = await Dibs.destroy({
        where: {
            dib_id: dibId
        }
    })

    return res.json({
        success: true,
        message: '찜 삭제',
        result: dibs
    })
})

router.get('/api/dibs', authMiddleware, async (req, res) => {
    const userId = res.locals.user.id;

    const dibs = await Dibs.findAll({
        where: {
            user_id: userId,
        },
        include: [{
            model: Festival
        }]
    })
    const result = dibs.map((item) => {
        item.dataValues.createdAt = formatDate(item.dataValues.createdAt)
        return item.dataValues;
    })
    res.json({
        success: true,
        result: result
    })
})

router.get('/dibs', authMiddleware, async (req, res) => {
    const userId = res.locals.user.id;

    const _dibs = await Dibs.findAll({
        where: {
            user_id: userId,
        },
        include: [{
            model: Festival
        }]
    })
    const dibs = _dibs.map((item) => {
        item.dataValues.createdAt = formatDate(item.dataValues.createdAt)
        return item.dataValues;
    })

    res.render('dibs', { dibs })
})

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
}



module.exports = router;