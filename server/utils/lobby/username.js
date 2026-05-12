const {
  MAX_USERNAME_LENGTH
} = require("../../constants/player")

function normalizeUsername(username) {
  return String(username || "")
    .trim()
}

function getUsernameError(username) {
  const normalizedUsername =
    normalizeUsername(username)

  if (!normalizedUsername) {
    return "Enter username"
  }

  if (
    [...normalizedUsername].length >
    MAX_USERNAME_LENGTH
  ) {
    return `Username max ${MAX_USERNAME_LENGTH} characters`
  }

  return null
}

module.exports = {
  normalizeUsername,
  getUsernameError
}
