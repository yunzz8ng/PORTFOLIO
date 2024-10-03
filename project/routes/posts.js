const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const Post = require("../models/Posts");


const app = express();
app.use(cookieParser());

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    Post.selectAll(req.body, (result) => {
      res.render("posts", { posts: result });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


// 특정 게시글 조회
// 특정 게시글 보기
router.get("/posts/:postId", async (req, res) => {
  try {
    Post.findById(req.params, (result) => {
      if (!result) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      }
      res.json({
        success: true,
        message: 'post 조회 완료',
        result: result
      })
      res.render("viewPost", { post: result });
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 수정하기
router.get("/posts/edit/:postId", async (req, res) => {
  try {
    Post.findById(req.params, (result) => {
      if (!result) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      }
      return res.render("editPost", { post: result });
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


// 게시글 작성
router.post("/posts", async (req, res) => {
  try {
    Post.insertPost(req.body, (result) => {
      res.json({
        success: true,
        message: 'post 생성 완료',
        result: result
      });
    });
    // res.json({posts});
    // res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 수정
// 비밀번호 비교 후 비밀번호 일치할 때만 수정
router.put("/posts/:postId", async (req, res) => {
  // postId 값 다르게 주고 try catch 빼고 실행
  console.log(req.body);
  try {
    const params = {
      postId: req.params.postId,
      title: req.body.title,
      content: req.body.content
    }
    // 조회 실패
    Post.findById(req.params, (result) => {
      if (!result) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      }
    })

    Post.updatePost(params, (result) => {
      return res.send({
        success: true,
        message: "게시글 수정 성공",
        result: result
      })
    });
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
router.delete("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // 조회 실패
    Post.findById(req.params, (result) => {
      if (!result) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      }
    })

    // 게시글 삭제
    Post.deletePost({ postId }, (result) => {
      return res.send({
        success: true,
        message: "게시글 삭제 성공",
        result: result
      })
    });
    // 게시글에 속한 댓글들 삭제
    // await Comment.destroy({
    //   where: { post_id: postId },
    // });

    // console.log(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
