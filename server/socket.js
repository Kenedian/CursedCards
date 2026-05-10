const registerAdminHandlers =
  require("./handlers/adminHandler")

const registerLobbyHandlers =
  require("./handlers/lobbyHandler")

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