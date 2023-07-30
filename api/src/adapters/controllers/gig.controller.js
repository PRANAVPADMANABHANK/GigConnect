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
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id); // "req.params.id" is the gig id

    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

// filtering using query params
export const getGigs = async (req, res, next) => {
  const q = req.query; // example of this output({ cat: 'design', search: 'g' })
  const filters = {
    ...(q.uerId && { userId: q.userId }), // If the q.userId exists (not undefined or empty), it adds a property userId with the value of q.userId to the filters object
    ...(q.cat && { cat: q.cat }), //  If the q.cat exists (not undefined or empty), it adds a property cat with the value of q.cat to the filters object
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }), //  If either q.min or q.max exists (not undefined or empty), it creates a nested price object with the properties
    ...(q.search && { title: { $regex: q.search, $options: "i" } }), // $options:"i" => gives the lower or uppercase search results
  };
  try {
    const gigs = await Gig.find(filters);
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};
