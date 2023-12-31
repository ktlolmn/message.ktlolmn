const User = require("../models/userModel")
const messageModel = require("../models/messageModel");


module.exports.addMessage = async (req,res,next) => {
    try{
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            massage: {text: message},
            users: [from, to],
            sender: from,
        })
        if(data) {
            return res.json({msg: "Message added successfully"})}
    }catch(ex){
        next(ex)
    }
};
module.exports.getAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body; 
        const messages = await messageModel.find({
            users: {
                $all: [from, to]
            }
        }).sort({ updatedAt: 1 });

        const projectMessages = messages.map((msg) => {            
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.massage.text,
            };
        });

        res.json(projectMessages);
    } catch (ex) {
        next(ex);
    }
};