const registerAdminHandlers =
  require("./handlers/adminHandler")

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