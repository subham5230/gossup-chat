const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");
const messageController = require("../controllers/messageController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatroomController.getAllChatrooms));
router.post("/", auth, catchErrors(chatroomController.createChatroom));
router.get("/get/:_id", auth, chatroomController.getChatroom);
router.get("/:_id", auth, messageController.getMessages);

module.exports = router;
