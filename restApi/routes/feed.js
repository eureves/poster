const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth").default;
const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/posts",
  [body("title").trim().isLength(5), isAuth, body("content").trim().isLength(5)],
  feedController.createPost
);
router.get("/post/:postId", isAuth, feedController.getPost);
router.put(
  "/post/:postId",
  isAuth,
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.putPost
);
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
