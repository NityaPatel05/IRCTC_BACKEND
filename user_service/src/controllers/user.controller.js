const asyncHandler = require("../utils/asyncHandler");
const { BadRequestError, NotFoundError } = require("../utils/error");
const userService = require("../services/user.service");
const logger = require("../config/logger");
const getDeviceFingerprint = require("../utils/deviceFingerprint");

exports.getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new BadRequestError("User Id is missing");
  }

  const user = await userService.getProfile(userId);
  return res.status(200).json({
    success: true,
    message: "Fetched user details",
    data: {
      user,
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new BadRequestError("User Id is missing");
  }

  const { firstName, lastName } = req.body;
  const updatedUser = await userService.updateProfile(userId, { firstName, lastName });
  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const deviceId = getDeviceFingerprint(req);
  if (!userId) {
    throw new BadRequestError("User Id is missing");
  }

  await userService.deleteProfile(userId, deviceId);
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({
      success: true,
      message: "User profile deleted successfully",
    });
});

exports.getUserInternal = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new BadRequestError("User Id is missing");
  }

  const user = await userService.getProfile(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});
