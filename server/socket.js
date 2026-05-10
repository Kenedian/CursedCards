const registerAdminHandlers =
  require("./handlers/admin/registerAdminHandlers")

const registerLobbyHandlers =
  require("./handlers/lobby/registerLobbyHandlers")

const registerGameHandlers =
  require("./handlers/game/registerGameHandlers")

module.exports =
function registerSocketHandlers(io) {

  io.on(
    "connection",

    socket => {

      console.log(
        "player connected:",
        socket.id
      )

      registerAdminHandlers(
        io,
        socket
      )

      registerLobbyHandlers(
        io,
        socket
      )

      registerGameHandlers(
        io,
        socket
      )

      socket.on(
        "disconnect",

        () => {

          console.log(
            "player disconnected:",
            socket.id
          )
        }
      )
    }
  )
}