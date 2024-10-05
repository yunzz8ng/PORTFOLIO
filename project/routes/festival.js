const express = require("express");
const { Festival, Dibs } = require("../models");
const router = express.Router();
var request = require('request');

router.get('/festival/:local', async (req, res) => {

    const local = req.params.local;
    const userId = 'wook';

    let searchFestival = await Festival.findAll({
        where: {
            festival_local: local
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

    console.log(result);
    res.render('festivalList', { festivals: result })
})

router.get('/api/festival', async (req, res) => {


    var url = 'http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('xml'); /* */
    queryParams += '&' + encodeURIComponent('fstvlNm') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('opar') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('fstvlStartDate') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('fstvlEndDate') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('fstvlCo') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('mnnstNm') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('auspcInsttNm') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('suprtInsttNm') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('phoneNumber') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('homepageUrl') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('relateInfo') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('rdnmadr') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('lnmadr') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('latitude') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('longitude') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('referenceDate') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('instt_code') + '=' + encodeURIComponent(''); /* */
    queryParams += '&' + encodeURIComponent('instt_nm') + '=' + encodeURIComponent(''); /* */

    let response = await request({
        url: url + queryParams,
        method: 'GET'
    })

    console.log(response)
})

module.exports = router;