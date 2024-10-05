const express = require("express");
const { Festival, Dibs } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


router.post('/dibs', authMiddleware, async (req, res) => {

    const festivalId = req.body.festivalId;
    const userId = res.locals.user.id;


    const dibs = await Dibs.findOne({
        where: {
            user_id: userId,
            festival_id: festivalId
        }
    })

    if (dibs && dibs.dataValues) {
        let result = await Dibs.destroy({
            where: {
                user_id: userId,
                festival_id: festivalId
            }
        })

        res.json({
            success: true,
            message: '찜 삭제',
            result: result
        })
    } else {

        let result = await Dibs.create({
            user_id: userId,
            festival_id: festivalId
        })

        res.json({
            success: true,
            message: '찜 생성',
            result: result
        })
    }

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
        return item.dataValues;
    })

    res.render('dibs', { dibs })
})



module.exports = router;