import User from "../../core/entities/user.model.js";
import createError from "../../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  } else {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted");
  }
};

export const getUser = async (req, res, next) => {
  // what all the params id that will fetch here

  // filter out the users based on the params id
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};
