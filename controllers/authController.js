const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const msg = require("../messages/responses");
const STATUS = require("../constants/statusCodes");

exports.register = async (req, res, next) => {
  try {
    const exists = await User.findOne({ where: { email: req.body.email } });
    if (exists)
      return res.status(STATUS.CONFLICT).json({ message: msg.auth.emailInUse });

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(STATUS.CREATED).json({
      message: msg.auth.registerSuccess,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.auth.userNotFound });

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok)
      return res.status(STATUS.UNAUTHORIZED).json({ message: msg.auth.invalidCredentials });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(STATUS.OK).json({
      message: msg.auth.loginSuccess,
      token,
    });
  } catch (err) {
    next(err);
  }
};
