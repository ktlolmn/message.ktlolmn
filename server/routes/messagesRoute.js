const router = require('express').Router();

const {getAllMessages, addMessage} = require('../controllers/messagesController')
router.post("/addMessage",addMessage);
router.post("/getAllMessages",getAllMessages);

module.exports = router;