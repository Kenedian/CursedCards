const {
  SOCKET_EVENTS
} = require(
  "../../../shared/constants/socketEvents"
)

const {

  updateCard,
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
function registerUpdateCard(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.ADMIN_UPDATE_CARD,

    cardData => {

      if (
        !isAdmin(socket.id)
      ) {

        return
      }

      const result =
        updateCard(
          cardData.type,
          cardData.id,
          cardData.text
        )

      if (!result.success) {

        socket.emit(
          SOCKET_EVENTS.ADMIN_ACTION_FAILED,

          result.reason ===
          "duplicate"

            ? "Duplicate card"

            : "Failed to update card"
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