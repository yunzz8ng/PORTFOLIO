const express = require("express");
const router = express.Router();


router.get('/festival/:local', (req, res) => {

    const local = req.params.local;
    console.log(local);
    const festivals = [
        { 
        id: 1,
        title: `${local} 페스티벌`,
        description: `${local} 최대 규모의 축제`,
        local: `${local}`,
        startDate: '2024-10-20',
        endDate: '2024-12-19',
        isDib: false,
        }, { 
        id: 2,
        title: `${local} 페스티벌`,
        description: `${local} 최대 규모의 축제 2`,
        local: `${local}`,
        startDate: '2024-10-20',
        endDate: '2024-12-30',
        isDib: true,
        }
    ]
    res.render('festivalList', { festivals: festivals })
})

module.exports = router;