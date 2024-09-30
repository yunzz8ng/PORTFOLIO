const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const { Post, Comment, Like } = require("../models/index");
const { Op } = require("sequelize");
const authMiddleWare = require("../middlewares/auth-middleware");

const app = express();
app.use(cookieParser());

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
        res.render("posts", { posts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});


// 특정 게시글 조회
// 특정 게시글 보기
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
        }
        res.render("viewPost", { post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// 특정 게시글 수정하기
router.get("/posts/edit/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
        }
        res.render("editPost", { post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});


// 게시글 작성
router.post("/posts", authMiddleWare, async (req, res) => {
    const { title, content } = req.body;
    const user_id = res.locals.user.id;
    try {
        const posts = await Post.create({
            title,
            content,
            user_id,
        });

        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// 특정 게시글 수정
// 비밀번호 비교 후 비밀번호 일치할 때만 수정
router.put("/posts/:postId", authMiddleWare, async (req, res) => {
    // postId 값 다르게 주고 try catch 빼고 실행
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        // 조회 실패
        const post = await Post.findByPk(postId);
        if (post === null) {
            return res.status(400).send({ message: "🛑 게시글이 없습니다." });
        }
        const result = await Post.update(
            { title: title, content: content },
            { where: { id: postId } }
        );

        return res.send({
            success: true,
            message: "게시글 수정 성공",
            result: result
        })
    } catch (error) {
        console.error(error);

        res.status(500).send({
            success: false,
            message: "게시글 수정 실패",
            result: error
        });
    }
});

// 특정 게시글 삭제
router.delete("/posts/:postId", authMiddleWare, async (req, res) => {
    try {
        const { postId } = req.params;

        // 조기 리턴
        const _post = await Post.findByPk(postId);
        if (_post === null) {
            return res.status(400).send({ message: "🛑 게시글이 없습니다." });
        }

        // 게시글 삭제
        await Post.destroy({
            where: { id: postId },
        });
        // 게시글에 속한 댓글들 삭제
        await Comment.destroy({
            where: { post_id: postId },
        });

        res.send("삭제완료!");
    } catch (error) {
        console.error(error);

        res.status(500).send({ message: error.message });
    }
});

module.exports = router;