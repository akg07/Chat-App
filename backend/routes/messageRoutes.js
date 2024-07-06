const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth-middleware");

const {
  sendMessage,
  allMessages,
  deleteAllMessage,
} = require("../controllers/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/delete/:chatId").put(protect, deleteAllMessage);

module.exports = router;
