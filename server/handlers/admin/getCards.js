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
  isAdmin
} = require(
  "../../services/admin/adminAuthService"
)

module.exports =
function registerGetCards(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.ADMIN_GET_CARDS,

    () => {

      if (
        !isAdmin(socket.id)
      ) {

        return
      }

      socket.emit(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

        getAllCards()
      )
    }
  )
}