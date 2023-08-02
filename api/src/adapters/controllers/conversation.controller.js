import createError from "../../utils/createError.js";
import Conversation from "../../core/entities/conversation.model.js";

export const createConversation = async (req, res, next) => {
    const newConversation = new Conversation({
        id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
        sellerId: req.isSeller ? req.userId : req.body.to,
        buyerId: req.isSeller ? req.body.to : req.body.to,
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
    })

    // "req.body.to" => id of the other person that we are going to send the message

    try {
        const savedConversation = await newConversation.save();
        res.status(201).send(savedConversation);
    } catch (err) {
        next(err);
    }

}

export const updateConversation = async (req, res) => {
    try {
        const updatedConversation = await Conversation.findOneAndUpdate({ id: req.params.id }, {
            $set: {
                readBySeller: req.isSeller,
                readByBuyer: !req.isSeller,
            },
        },
            {
                new: true
            }
        );

        res.status(200).send(updatedConversation);

    } catch (err) {
        next(err);
    }
}

export const getSingleConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.id });
        res.status(200).send(conversation);
    } catch (err) {
        next(err);
    }
}

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId });
        res.status(200).send(conversations);
    } catch (err) {
        next(err);
    }
}