const service = require("../services/auth.service");
const response = require("../utils/response");

/* REGISTER */
exports.register = async (req, res) => {
  try {
    const message = await service.registerUser(req.body);
    return response.created(res, message);
  } catch (err) {
    return response.error(res, err.message);
  }
};

/* VERIFY EMAIL */
exports.verifyEmail = async (req, res) => {
  try {
    const message = await service.verifyEmailOtp(req.body);
    return response.success(res, message);
  } catch (err) {
    return response.error(res, err.message);
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  try {
    const data = await service.loginUser(req.body);
    return response.success(res, data.message, { token: data.token });
  } catch (err) {
    return response.error(res, err.message);
  }
};

/* FORGOT PASSWORD */
exports.forgotPassword = async (req, res) => {
  try {
    const message = await service.forgotPassword(req.body);
    return response.success(res, message);
  } catch (err) {
    return response.error(res, err.message);
  }
};

/* VERIFY RESET OTP */
exports.verifyResetOtp = async (req, res) => {
  try {
    const message = await service.verifyResetOtp(req.body);
    return response.success(res, message);
  } catch (err) {
    return response.error(res, err.message);
  }
};

/* RESET PASSWORD */
exports.resetPassword = async (req, res) => {
  try {
    const message = await service.resetPassword(req.body);
    return response.success(res, message);
  } catch (err) {
    return response.error(res, err.message);
  }
};
