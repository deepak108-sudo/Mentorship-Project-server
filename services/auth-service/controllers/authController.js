import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwtUtils.js";
import { publishToQueue } from "../utils/rabbitmq.js";

//--------------------------------Register----------------------------------------
const register = async (req, res) => {
  try {
    const { email, password, role, ...profiledata } = req.body;

    //Check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new User
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    //Publishing the additional data too rabbitMQ
    await publishToQueue("user_registration",{
      userId:newUser._id,
      role,
      profileData:profiledata,
    })

    console.log("User registered Successfully");
    return res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


//----------------------------------Login-------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //compare password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ msg: "Invalid Credentials" });

    //create jwt
    const token=generateToken(user);

    console.log(`Token: ${token}`);
    res.status(200).json({
      status: "success",
      message: "Login Successful",
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};

export { register, login };
