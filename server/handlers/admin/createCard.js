const {
  SOCKET_EVENTS
} = require(
  "../../../shared/constants/socketEvents"
)

const {

  createCard,
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
function registerCreateCard(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.ADMIN_CREATE_CARD,

    async cardData => {

      if (
        !isAdmin(socket.id)
      ) {

        return
      }

      const result =
        await createCard(
          cardData.type,
          cardData.text
        )

      if (!result.success) {

        socket.emit(
          SOCKET_EVENTS.ADMIN_ACTION_FAILED,

          result.reason ===
          "duplicate"

            ? "Duplicate card"

            : "Failed to create card"
        )

        return
      }

      io.emit(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

        await getAllCards()
      )
    }
  )
}