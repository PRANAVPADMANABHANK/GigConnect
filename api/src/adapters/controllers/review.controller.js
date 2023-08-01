import Gig from "../../core/entities/gig.model.js";
import Review from "../../core/entities/review.model.js";
import createError from "../../utils/createError.js";

export const createReview = async (req, res, next) => {

  // check weather seller or not. Because seller can't create the review
  if (req.isSeller) return next(createError(403, "Seller can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  // async only should inside try block
  try {

    // if a buyer created a review using a gigId they shouldn't allow to create another review using the same gigId
    const review = await Review.findOne({ gigId: req.body.gigId, userId: req.userId });
    if (review) return next(createError(403, "You have already created a review for this gig!"));

    // save in db
    const savedReview = await newReview.save();
    res.status(201).send(savedReview);

    // giving star in Review so need to update in db
    await Gig.findOneAndUpdate(req.body.gigId, { $inc: { totalStars: req.body.star, starNumber: 1 } });

  } catch (err) {
    next(err)
  }
}

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);

  } catch (err) {
    next(err)
  }
}

export const deleteReview = async (req, res, next) => {
  try {

  } catch (err) {
    next(err)
  }
}