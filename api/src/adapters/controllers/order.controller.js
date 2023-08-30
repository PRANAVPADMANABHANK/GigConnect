import createError from "../../utils/createError.js";
import User from "../../core/entities/user.model.js";
import Order from "../../core/entities/order.model.js";
import Wallet from "../../core/entities/wallet.model.js"
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
    status:"pending",
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
    const sellerIds = orders.map((order) => order.sellerId); // Extract sellerIds from orders
    // console.log(buyerIds, "buyerIds")
    // console.log(sellerIds, "sellerIds")

    const buyers = await User.find({ _id: { $in: buyerIds } }, "username");
    const sellers = await User.find({ _id: { $in: sellerIds } }, "username"); // Retrieve sellers' names
    // console.log(buyers, "buyers")
    // console.log(sellers," sellers")

    const ordersWithNames = orders.map((order) => {
      const buyer = buyers.find((buyer) => buyer._id.equals(order.buyerId));
      const seller = sellers.find((seller) =>
        seller._id.equals(order.sellerId)
      );
      return {
        ...order._doc,
        buyerName: buyer ? buyer.username : "Unknown Buyer",
        sellerName: seller ? seller.username : "Unknown Seller",
      };
    });

    // console.log(ordersWithNames, "ordersWithNames")

    res.status(200).json({
      orders: ordersWithNames,
      buyers,
      sellers,
    });

    // console.log(orders, "orders")
    // res.status(200).send(orders);
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
    await Order.updateOne(
      { _id: id },
      { $set: { status: "Cancelled" } }
    );

    
    return res.status(200).json({ message: "Balance updated successfully", price: completedOrder[0].buyer.wallet[0].balance, status: completedOrder[0].status });

  } catch (error) {
    next(error);
  }
};



export const acceptOrder = async(req, res, next) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    // Update the status of the completed order to "Cancelled"
    await Order.updateOne(
      { _id: id },
      { $set: { status: "Accepted" } }
    );

    const status = await Order.findById(id)
    console.log(status, "status")
    return res.status(200).json({message: "Order accept successfull", status})
  } catch (err) {
    next(createError(error))
  }
}
