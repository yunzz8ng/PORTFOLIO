const express = require("express");
const router = express.Router();
const { Post, likes, User } = require("../models");
const authMiddleWare = require("../middlewares/auth-middleware");

router.get("/likes/posts", authMiddleWare, async (req, res) => {
  const user_id = res.locals.user.userId;
  console.log(res.locals.user);

  const data = await likes.findAll({
    where: { user_id: user_id },
    raw: true,
    attributes: ["Post.user_id", "Post.title", "Post.content", "Post.like_cnt"],
    include: [
      {
        model: Post,
        attributes: [],
      },
    ],
    order: [[Post, "like_cnt", "desc"]],
  });

  console.log("********", data);

  res.status(200).json({ data });
});

router.put("/posts/:postId/like", authMiddleWare, async (req, res) => {
  const user_id = res.locals.user.userId;
  const { postId } = req.params;

  const existlike = await likes.findOne({
    where: { user_id, post_id: postId },
  });

  try {
    if (!existlike) {
      await likes.create({
        user_id: user_id,
        post_id: postId,
      });

      await Post.increment({ like_cnt: 1 }, { where: { postId } });
      return res.status(200).send("좋아요");
    } else {
      likes.destroy({
        where: { post_id: postId },
      });

      await Post.decrement({ like_cnt: 1 }, { where: { postId } });
      return res.status(200).send("싫어요");
    }
  } catch (error) {
    res.status(400).send({ errorMessage: "게시글 좋아요에 실패하였습니다." });
  }
});

module.exports = router;
app.js
const express = require("express");
const app = express();

const loginRouter = require("./routers/login");
const registerRouter = require("./routers/register");
const postRouter = require("./routers/posts");
const commentRouter = require("./routers/comments");
const likesRouter = require("./routers/likes");

app.use(express.json());

app.use("/api", [
  registerRouter,
  loginRouter,
  postRouter,
  commentRouter,
  likesRouter,
]);

app.get("/", (req, res) => {
  res.send("Welcome to my page");
});

app.listen(3000, () => {
  console.log("서버 접속");
});