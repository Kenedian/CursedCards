const registerAdminLogin =
  require("./login")

const registerGetCards =
  require("./getCards")

const registerCreateCard =
  require("./createCard")

const registerUpdateCard =
  require("./updateCard")

const registerDeleteCard =
  require("./deleteCard")

const {
  removeAdmin
} = require(
  "../../services/admin/adminAuthService"
)

module.exports =
function registerAdminHandlers(
  io,
  socket
) {

  registerAdminLogin(
    io,
    socket
  )

  registerGetCards(
    io,
    socket
  )

  registerCreateCard(
    io,
    socket
  )

  registerUpdateCard(
    io,
    socket
  )

  registerDeleteCard(
    io,
    socket
  )

  socket.on(
    "disconnect",

    () => {

      removeAdmin(
        socket.id
      )
    }
  )
}