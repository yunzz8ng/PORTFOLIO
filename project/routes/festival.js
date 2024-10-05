const express = require("express");
const { Festival, Dibs } = require("../models");
const router = express.Router();
const { Op } = require('sequelize');
const authMiddleware = require("../middlewares/auth-middleware");

router.get('/festival/:local', authMiddleware, async (req, res) => {

    const local = getLocal(req.params.local);

    console.log('local')
    console.log(local)


    const userId = res.locals.user.id;

    let searchFestival = await Festival.findAll({
        where: {
            festival_local: {
                [Op.like]: `%${local}%`
            }
        },
        order: [['festival_start_date', 'ASC']]
    })

    const ids = searchFestival.map((item) => {
        return item.dataValues.festival_id;
    })

    const dibs = await Dibs.findAll({
        where: {
            festival_id: ids,
            user_id: userId
        }
    })

    const dibsMap = {};
    dibs.forEach(dib => {
        dibsMap[dib.festival_id] = dib.dib_id; // festival_id를 키로 dib_id 저장
    });

    const result = searchFestival.map(festival => {
        return {
            ...festival.dataValues,
            isDib: dibsMap[festival.festival_id] ? true : false // Dibs 정보 추가
        };
    });
    res.render('festivalList', { festivals: result })
})

const getLocal = (local) => {
    if (local.includes('전라북도')) {
        return '전북특별자치도'
    } else if (local.includes('강원도')) {
        return '강원특별자치도'
    } else if (local.includes('제주도')) {
        return '제주특별자치도'
    } else {
        return local
    }
}

module.exports = router;