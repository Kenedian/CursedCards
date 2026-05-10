const {
  SOCKET_EVENTS
} = require(
  "../../../shared/constants/socketEvents"
)

const {

  deleteCard,
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
function registerDeleteCard(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.ADMIN_DELETE_CARD,

    cardData => {

      if (
        !isAdmin(socket.id)
      ) {

        return
      }

      const result =
        deleteCard(
          cardData.type,
          cardData.id
        )

      if (!result.success) {

        socket.emit(
          SOCKET_EVENTS.ADMIN_ACTION_FAILED,

          "Failed to delete card"
        )

        return
      }

      io.emit(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

        getAllCards()
      )
    }
  )
}