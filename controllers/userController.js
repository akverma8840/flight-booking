const bcrypt = require("bcrypt");
const { User } = require("../models");
const msg = require("../messages/responses");
const STATUS = require("../constants/statusCodes");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.auth.userNotFound });

    return res.status(STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.auth.userNotFound });

    if (req.body.password)
      req.body.password = await bcrypt.hash(req.body.password, 10);

    await user.update(req.body);

    return res.status(STATUS.OK).json({
      message: msg.user.profileUpdated,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(STATUS.OK).json(users);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.auth.userNotFound });

    await user.destroy();

    return res.status(STATUS.OK).json({
      message: msg.user.userDeleted,
    });
  } catch (err) {
    next(err);
  }
};
