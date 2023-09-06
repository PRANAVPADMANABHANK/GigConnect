import User from "../../core/entities/user.model.js";
import createError from "../../utils/createError.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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
  console.log(req.body.userType);

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

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};

export const forgotPassword = async (req, res, next) => {
  console.log(req.body.value, "]]]]]]");

  try {
    const user = await User.findOne({ email: req.body.value }); // Use await when calling asynchronous functions like findOne
    console.log(user);
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1d",
      });
      console.log(token, "]]]]]]]]]]");

      //nodemailer configeration
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pranavkkeloth@gmail.com",
          pass: "mnbuduawybcoyclt",
        },
      });

      var mailOptions = {
        from: "pranavkkeloth@gmail.com",
        to: req.body.value,
        subject: "Reset Password Link",
        text: `http://localhost:5173/reset-password/${user._id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.send({ Status: "Success" });
        }
      });

      res
        .status(200)
        .json({ message: "User found. Password recovery initiated." });
    } else {
      // User not found
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    return next(createError(500, "Server error."));
  }
};

export const resetPassword = async (req, res, next) => {
  console.log("reset password");

  const { id, token } = req.params;
  const password = req.body.value;
  console.log(password, "password");

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      return next(createError(401, "Error with token")); // Sending a 401 Unauthorized status
    } else {
      const hashPassword = bcrypt.hashSync(password, 10);
      console.log(hashPassword, "hashPassword");
      try {
        // Your password reset logic here

        // Assuming you're updating the password for the user with the given ID
        await User.findByIdAndUpdate(id, { password: hashPassword });

        res.status(200).send("Password reset successful"); // Sending a success response
      } catch (error) {
        next(error);
      }
    }
  });
};

//search users in chat using queries
export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.userId } });
  res.send(users);
};
