const { config } = require("../config");
const { redis } = require("../config/redis");
const prisma = require("../config/prisma");
const logger = require("../config/logger");
const { NotFoundError } = require("../utils/error");

const getProfile = async (userId) => {
  logger.info("First check user in Redis");

  const storedUser = await redis.get(`user:${userId}`);
  if (storedUser) {
    logger.info("Fetched user profile from redis");
    return JSON.parse(storedUser);
  }
  logger.info("If user is not in redis, fetch user from DB");
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userProfile) {
    throw new NotFoundError("User not found");
  }

  logger.info("Exclude password field from the user");
  const { password: _password, ...safeUser } = userProfile;
  logger.info("Store user profile in redis for future lookups");
  await redis.set(
    `user:${userId}`,
    JSON.stringify(safeUser),
    "EX",
    config.REDIS_USER_TTL,
  );
  return safeUser;
};

const updateProfile = async (userId, data) => {
  logger.info(`Updating user profile for user: ${userId}`);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { password: _password, ...safeUser } = updatedUser;
  await redis.set(
    `user:${userId}`,
    JSON.stringify(safeUser),
    "EX",
    config.REDIS_USER_TTL,
  );
  return safeUser;
};

const deleteProfile = async (userId, deviceId) => {
  logger.info(`Deleting user profile for user: ${userId}`);
  await prisma.user.delete({
    where: { id: userId },
  });
  await redis.del(`user:${userId}`);
  if (deviceId) {
    await redis.del(`refresh:${userId}:${deviceId}`);
  }
};

module.exports = { getProfile, updateProfile, deleteProfile };
