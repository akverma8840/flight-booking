const redis = require("../redisClient");

async function lockSeat(seatId, userId, flightId) {
  const key = `seat_lock:${flightId}:${seatId}`;

  const alreadyLocked = await redis.get(key);
  if (alreadyLocked) {
    return { success: false, message: "Seat already locked by another user" };
  }

  await redis.set(key, userId, "EX", 30); // Locks for 30 seconds
  return { success: true, message: "Seat locked successfully" };
}

module.exports = { lockSeat };
