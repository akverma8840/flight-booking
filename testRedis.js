const redis = require("./redisClient");

(async () => {
  await redis.set("test", "Hello Redis");
  const result = await redis.get("test");
  console.log("Redis Output:", result);
  process.exit();
})();
