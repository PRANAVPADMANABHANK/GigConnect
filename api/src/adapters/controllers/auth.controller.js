import User from "../../core/entities/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../../utils/createError.js";
import Wallet from "../../core/entities/wallet.model.js";

export const register = async (req, res, next) => {
  try {
    // Check if the password and confirmPassword match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash both the password and confirmPassword
    const hash = bcrypt.hashSync(req.body.password, 5);
    const confirmHash = bcrypt.hashSync(req.body.confirmPassword, 5);

    // Create a new Wallet for the user with default balance
    const newWallet = new Wallet({ balance: 0 });
    await newWallet.save();

    const newUser = new User({
      ...req.body,
      password: hash,
      confirmPassword: confirmHash, // Hashed confirmPassword
      wallet: newWallet._id, // Assign the wallet reference to the user
    });
    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username, isBlocked: false });

    if (!user) return next(createError(404, "User not found")); // import "creatError" function that seperately added in a "util => createError.js" file

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;

    //send token using cookie. "accessToken" is the cookie name
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out."); //here clear the cookie from our browser
};
