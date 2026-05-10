const admins =
  new Set()

function authenticateAdmin(
  socketId,
  password
) {

  if (
    password !==
    process.env.ADMIN_PASSWORD
  ) {

    return false
  }

  admins.add(socketId)

  return true
}

function removeAdmin(
  socketId
) {

  admins.delete(socketId)
}

function isAdmin(
  socketId
) {

  return admins.has(
    socketId
  )
}

module.exports = {

  authenticateAdmin,
  removeAdmin,
  isAdmin
}