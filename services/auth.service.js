const bcrypt = require("bcrypt");
const { User } = require("../models");
const { sendEmail } = require("../utils/email");

const messages = require("../utils/messages");
const CONST = require("../constants/appConstants");

const { generateOtp } = require("./otp.service");

const { generateToken } = require("./token.service");

/* REGISTER */
exports.registerUser = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const { otp, expiry } = generateOtp();

  await User.create({
    name,
    email,
    password: hashed,
    role: role || CONST.ROLES.USER,
    isVerified: false,
    emailOtp: otp,
    emailOtpExpiry: expiry,
  });

  await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);

  return messages.AUTH.REGISTER_SUCCESS;
};

/* VERIFY EMAIL OTP */
exports.verifyEmailOtp = async ({ email, otp }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error(messages.AUTH.INVALID_EMAIL);

  if (user.emailOtp !== otp) throw new Error(messages.AUTH.OTP_INVALID);
  if (new Date() > user.emailOtpExpiry) throw new Error(messages.AUTH.OTP_EXPIRED);

  await user.update({
    isVerified: true,
    emailOtp: null,
    emailOtpExpiry: null,
  });

  return messages.AUTH.EMAIL_VERIFIED;
};

/* LOGIN */
exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error(messages.AUTH.INVALID_PASSWORD);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error(messages.AUTH.INVALID_PASSWORD);

  if (!user.isVerified) throw new Error(messages.AUTH.VERIFY_EMAIL);

  const token = generateToken(user);
  return { token, message: messages.AUTH.LOGIN_SUCCESS };
};

/* FORGOT PASSWORD */
exports.forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error(messages.AUTH.INVALID_EMAIL);

  const { otp, expiry } = generateOtp();

  await user.update({
    resetOtp: otp,
    resetOtpExpiry: expiry,
  });

  await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

  return messages.AUTH.OTP_SENT;
};

/* VERIFY RESET OTP */
exports.verifyResetOtp = async ({ email, otp }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error(messages.AUTH.INVALID_EMAIL);

  if (user.resetOtp !== otp) throw new Error(messages.AUTH.OTP_INVALID);
  if (new Date() > user.resetOtpExpiry) throw new Error(messages.AUTH.OTP_EXPIRED);

  return "OTP Verified";
};

/* RESET PASSWORD */
exports.resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error(messages.AUTH.INVALID_EMAIL);

  if (user.resetOtp !== otp) throw new Error(messages.AUTH.OTP_INVALID);
  if (new Date() > user.resetOtpExpiry) throw new Error(messages.AUTH.OTP_EXPIRED);

  const hashed = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashed,
    resetOtp: null,
    resetOtpExpiry: null,
  });

  return messages.AUTH.PASSWORD_RESET_SUCCESS;
};
