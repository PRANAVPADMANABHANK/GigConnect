import Gig from "../../core/entities/gig.model.js";
import createError from "../../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    // its verified from jwt
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId, // its taken from jwt
    ...req.body,
  });
  try {
    const savedGig = await newGig.save();
    res.send(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
  } catch (err) {}
};

export const getGigs = async (req, res, next) => {
  try {
  } catch (err) {}
};
