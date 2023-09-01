import User from "../../core/entities/user.model.js";
import Admin from "../../core/entities/adminRegister.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from "../../utils/createError.js";

export const userList = async (req, res) => {
  try {
    const users = await User.find(); // Fetches all users from the database
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};



export const adminRegister = async (req, res) => {
  console.log('Admin Registration');

  try {
    const { username, email, password } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with the same username or email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const adminLogin = async (req, res, next) => {
    console.log("adminLogin")
    const { email, password } = req.body; // Extract email and password from the request body


    console.log(email)
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) return next(createError(404, "Admin not found"));

    const isCorrect = bcrypt.compareSync(req.body.password, admin.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: admin._id,
        isAdmin: true, // You can add this field to distinguish admin from user tokens
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = admin._doc;

    // Send token using cookie. "accessToken" is the cookie name
    res
      .cookie("adminAccessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};


export const adminLogout = async (req, res) => {
  res
    .clearCookie("adminAccessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out."); //here clear the cookie from our browser
};