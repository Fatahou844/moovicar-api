const crypto = require("crypto");

function generateToken(size = 32) {
  // 32 bytes => 64 chars hex
  return crypto.randomBytes(size).toString("hex");
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

module.exports = { generateToken, addMinutes };
