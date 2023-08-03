import createError from "../../utils/createError.js";
import Order from "../../core/entities/order.model.js";
import Gig from "../../core/entities/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {

    const stripe = new Stripe(
        process.env.STRIPE
    );

    const gig = await Gig.findById(req.params.id);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: gig.price * 100, // convert to usd with out *100 it will be in cents
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    const newOrder = new Order({
        gigId: gig._id,
        img: gig.cover,
        title: gig.title,
        buyerId: req.userId,
        sellerId: gig.userId,
        price: gig.price,
        payment_intent: paymentIntent.id,
    });

    await newOrder.save();
    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    })
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

export const confirm = async (req, res, next) => {
    try {
        const orders = await Order.findOneAndUpdate({
            payment_intent: req.body.payment_intent,
        }, {
            $set: {
                isCompleted: true
            },
        });
        res.status(200).send("Order has been confirmed.");
    } catch (err) {
        next(err);
    }
}