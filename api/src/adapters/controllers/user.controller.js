import User from "../../core/entities/user.model.js";
import createError from "../../utils/createError.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

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


export const updateProfile = async (req, res) => {
  const {
    _id,
    username,
    description,
    email,
    country,
    phoneNumber,
    userType,
    image,
  } = req.body;

  const userId = new ObjectId(_id);
  console.log(req.body.userType)

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          username: username,
          desc: description,
          email: email,
          country: country,
          phone: phoneNumber,
          isSeller: userType === "Buyer" ? false : true,
          img: image,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "An error occurred while updating the profile" });
  }
};


