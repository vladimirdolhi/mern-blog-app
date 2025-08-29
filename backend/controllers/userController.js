const asyncHandler = require("express-async-handler");
const userService = require("../service/userService");
const passwordResetService = require("../service/passwordResetService");

const registration = asyncHandler(async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const userData = await userService.registration(email, name, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
});

const logout = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  } catch (e) {
    next(e);
  }
});

const refresh = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    await passwordResetService.requestReset(email);
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await passwordResetService.resetPassword(token, password);
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = {
  registration,
  login,
  logout,
  refresh,
  resetPassword,
  forgotPassword,
};
