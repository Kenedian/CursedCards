const registerCreateLobby =
  require("./createLobby")

const registerJoinLobby =
  require("./joinLobby")

const registerLeaveLobby =
  require("./leaveLobby")

const registerDisconnect =
  require("./disconnect")

const registerKickPlayer =
  require("./kickPlayer")

module.exports =
function registerLobbyHandlers(
  io,
  socket
) {

  registerCreateLobby(
    io,
    socket
  )

  registerJoinLobby(
    io,
    socket
  )

  registerLeaveLobby(
    io,
    socket
  )

  registerDisconnect(
    io,
    socket
  )

  registerKickPlayer(
    io,
    socket
  )
}