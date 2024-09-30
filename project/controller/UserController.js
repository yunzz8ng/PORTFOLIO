const User = require("../models/User");

//메인화면=회원가입화면
exports.index = (req, res) => {
    res.render("index");
}
exports.get_join = (req, res) => {
    res.render("join");
}

//User 정보 저장하기
exports.post_user = (req, res) => {

    User.insert(req.body, function (result) {
        res.send({ id: result });
    })
}

//login 화면
exports.login = (req, res) => {
    res.render("login");
}

//login 시도
exports.post_login = (req, res) => {
    User.select(req.body.id, req.body.password, function (result) {
        if (result == null) {
            return res.send({ result: result, flag: false });
        } else {
            if (req.body.password != result.password) {
                return res.send({ result: result, flag: false });
            } else {
                return res.send({ result: result, flag: true });
            }
        }
    });
}

//회원정보 수정 화면
exports.edit = (req, res) => {
    User.get_user(req.body.id, function (result) {
        res.render("edit", { data: result[0] });
    });
}

//정보 수정
exports.patch_user = (req, res) => {
    User.update(req.body, function (result) {
        console.log("update result:", result);
        res.send("수정완료");
    });
}

//정보 삭제
exports.delete_user = (req, res) => {
    User.delete(req.body.id, function (result) {
        console.log("delete result:", result);
        res.send("success Delete!");
    });
}
