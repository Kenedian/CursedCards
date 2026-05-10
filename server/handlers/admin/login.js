const {
  SOCKET_EVENTS
} = require(
  "../../../shared/constants/socketEvents"
)

const {
  getAllCards
} = require(
  "../../services/cardService"
)

const {

  authenticateAdmin

} = require(
  "../../services/admin/adminAuthService"
)

module.exports =
function registerAdminLogin(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.ADMIN_LOGIN,

    password => {

      const success =

        authenticateAdmin(
          socket.id,
          password
        )

      if (!success) {

        socket.emit(
          SOCKET_EVENTS.ADMIN_LOGIN_FAILED
        )

        console.log(
          "admin auth failed:",
          socket.id
        )

        return
      }

      socket.emit(
        SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS
      )

      socket.emit(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

        getAllCards()
      )

      console.log(
        "admin authenticated:",
        socket.id
      )
    }
  )
}