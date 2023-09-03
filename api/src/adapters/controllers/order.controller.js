import createError from "../../utils/createError.js";
import User from "../../core/entities/user.model.js";
import Order from "../../core/entities/order.model.js";
import Wallet from "../../core/entities/wallet.model.js";
import Gig from "../../core/entities/gig.model.js";
import { Types } from "mongoose"; // Import Types from mongoose
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

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
    status: "pending",
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    const buyerIds = orders.map((order) => order.buyerId);
    const sellerIds = orders.map((order) => order.sellerId);

    // Fetch gig details for each order by matching gigId with _id in the Gig collection
    const ordersWithGigDetails = await Promise.all(
      orders.map(async (order) => {
        const buyer = buyerIds.includes(order.buyerId)
          ? await User.findById(order.buyerId, "username")
          : null;
        const seller = sellerIds.includes(order.sellerId)
          ? await User.findById(order.sellerId, "username")
          : null;

        const gig = await Gig.findById(order.gigId);

        return {
          ...order._doc,
          buyerName: buyer ? buyer.username : "Unknown Buyer",
          sellerName: seller ? seller.username : "Unknown Seller",
          deliveryTime: gig ? gig.deliveryTime : "N/A",
          revisionNumber: gig ? gig.revisionNumber : "N/A",
        };
      })
    );

    res.status(200).json({
      orders: ordersWithGigDetails,
    });
  } catch (error) {
    next(err);
  }
};

export const getOrderWithId = async (req, res, next) => {
  const orderId = req.params.id; // Get the order ID from the request parameters

  try {
    // Find the order by ID and isCompleted status
    const order = await Order.findOne({ gigId: orderId, isCompleted: true });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    return res.status(200).send(order);
  } catch (error) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

export const cancelWalletAmount = async (req, res, next) => {
  console.log(req.params.id, "params");
  try {
    const id = new Types.ObjectId(req.params.id);

    // Find the completed order based on the provided ID
    const completedOrder = await Order.aggregate([
      {
        $match: {
          _id: id,
          isCompleted: true,
          status: { $ne: "Cancelled" }, // Ensure the order is not already cancelled
        },
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          let: { buyerId: { $toObjectId: "$buyerId" } }, // Convert buyerId to ObjectId
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$buyerId"] }, // Compare _id with converted buyerId
              },
            },
          ],
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer", // Unwind the array
      },
      {
        $lookup: {
          from: "wallets", // Name of the wallets collection
          localField: "buyer.wallet",
          foreignField: "_id",
          as: "buyer.wallet",
        },
      },
    ]);

    console.log(completedOrder[0].price, "completedOrder");
    console.log(completedOrder[0].buyer.wallet[0].balance, "completedOrder");
    console.log(completedOrder[0].buyer.wallet[0]._id, "completedOrder");

    if (!completedOrder) {
      return res.status(404).json({ message: "Completed order not found" });
    }

    const price = completedOrder[0].price;
    const walletId = completedOrder[0].buyer.wallet[0]._id;
    // Update the wallet's balance with the price
    await Wallet.updateOne(
      { _id: walletId },
      { $inc: { balance: price } } // Increment the balance by the order price
    );

    // Update the status of the completed order to "Cancelled"
    await Order.updateOne({ _id: id }, { $set: { status: "Cancelled" } });

    return res.status(200).json({
      message: "Balance updated successfully",
      price: completedOrder[0].buyer.wallet[0].balance,
      status: completedOrder[0].status,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    // Check if the order is not already in the "Accepted" state
    const existingOrder = await Order.findOne({
      _id: id,
      status: { $ne: "Accepted" },
    });

    if (!existingOrder) {
      return res.status(400).json({ message: "Order is already Accepted" });
    }

    // Update the status of the order to "Accepted"
    await Order.updateOne({ _id: id }, { $set: { status: "Accepted" } });

    const status = await Order.findById(id);
    return res.status(200).json({ message: "Order accept successful", status });
  } catch (err) {
    next(createError(error));
  }
};

export const submitWork = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Find the order by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the submission field to "Work completed"
    order.submission = "Work completed";

    // Save the updated order
    await order.save();

    res.status(200).json({ message: "Work submitted successfully" });
  } catch (error) {
    next(createError(error));
  }
};
