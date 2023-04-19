const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });

    if (userCheck)
      return res.json({ message: "username already exist", status: false });
    if (emailCheck)
      return res.json({ message: "email already exist", status: false });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    delete user.password;
    res.status(201).json({ status: true, user });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
    next(err);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ message: "User Not Found", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ message: "Password not valid", status: false });

    delete user.password;
    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(400).json({ message: error, status: false });
    next(error);
  }
};
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: avatarImage,
    });
    res.status(200).json({
      status: true,
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    res.status(400).json({ message: error, status: false });
    next(error);
  }
};
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "-password",
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error, status: false });
    next(error);
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    if (!req.params.id)
      res.status(400).json({ status: false, message: "Something went wrong" });

    onlineUsers.delete(req.params.id);
    return res.status(200).json({ status: 200, message: "logout successfull" });
  } catch (error) {
    res.status(400).json({ message: error, status: false });
    next(error);
  }
};
