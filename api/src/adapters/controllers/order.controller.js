import createError from "../../utils/createError.js";
import Order from "../../core/entities/order.model.js";
import Gig from "../../core/entities/gig.model.js";

export const createOrder = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.gigId)

        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: req.userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: "temporary",
        });

        await newOrder.save();
        res.status(200).send("successfull");

    } catch (err) {
        next(err)
    }

}

export const getOrder = async (req, res, next) => {
    try {
        const orders = await Order.find({
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
            isCompleted: true,
        });
        res.status(200).send(orders);
    } catch (error) {
        next(err);
    }
}